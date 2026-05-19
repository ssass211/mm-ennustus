import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export async function GET(request: Request) {
  // Check authorization header to prevent public execution (unless it's Vercel Cron)
  const authHeader = request.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Use Service Role key to bypass RLS and access auth users
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const now = new Date();
    // Look for matches starting in the next 15-30 minutes
    const minTime = new Date(now.getTime() + 14 * 60000).toISOString();
    const maxTime = new Date(now.getTime() + 31 * 60000).toISOString();

    const { data: upcomingMatches, error: matchesError } = await supabase
      .from('matches')
      .select('*, home_team:teams!home_team_id(*), away_team:teams!away_team_id(*)')
      .gte('match_datetime', minTime)
      .lte('match_datetime', maxTime);

    if (matchesError) throw matchesError;
    if (!upcomingMatches || upcomingMatches.length === 0) {
      return NextResponse.json({ success: true, message: 'No upcoming matches', sent: 0 });
    }

    // Get profiles with reminders enabled
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, display_name')
      .eq('email_reminders_enabled', true);

    if (profilesError) throw profilesError;
    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ success: true, message: 'No users opted in', sent: 0 });
    }

    // Get auth users to retrieve email addresses
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) throw authError;

    // Get existing predictions for these matches
    const matchIds = upcomingMatches.map(m => m.id);
    const { data: predictions, error: predsError } = await supabase
      .from('match_predictions')
      .select('user_id, match_id')
      .in('match_id', matchIds);

    if (predsError) throw predsError;

    let sentCount = 0;
    const errors = [];

    // Process each match
    for (const match of upcomingMatches) {
      const matchName = `${match.home_team.code} vs ${match.away_team.code}`;
      const matchTime = new Date(match.match_datetime).toLocaleTimeString('et-EE', { hour: '2-digit', minute: '2-digit' });

      // Find users who haven't predicted this match
      for (const profile of profiles) {
        const hasPredicted = predictions?.some(p => p.match_id === match.id && p.user_id === profile.id);
        
        if (!hasPredicted) {
          const authUser = users.find(u => u.id === profile.id);
          if (authUser && authUser.email) {
            
            // Send email
            if (process.env.RESEND_API_KEY) {
              const { error: emailError } = await resend.emails.send({
                from: 'MM Ennustus <no-reply@sinudomeen.ee>', // UPDATE THIS
                to: authUser.email,
                subject: `🚨 Mäng ${matchName} algab peagi! Ennustus tegemata!`,
                html: `
                  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
                    <h2 style="color: #333;">Tere, ${profile.display_name}!</h2>
                    <p style="font-size: 16px; color: #555;">
                      Sinu ennustus on tegemata mängule <strong>${match.home_team.name_et} vs ${match.away_team.name_et}</strong>, mis algab kell ${matchTime}.
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${process.env.NEXT_PUBLIC_APP_URL}/matches/${match.id}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                        Tee ennustus kohe
                      </a>
                    </div>
                    <p style="font-size: 12px; color: #999; margin-top: 30px; text-align: center;">
                      Sina saad seda kirja, sest oled lubanud MM Ennustuse portaalil saata meeldetuletusi. 
                      Saad teavitustest loobuda oma profiili seadete lehel.
                    </p>
                  </div>
                `
              });

              if (emailError) {
                errors.push({ user: profile.id, error: emailError });
              } else {
                sentCount++;
              }
            } else {
              // Log only if no API key
              console.log(`Would send to ${authUser.email} for match ${matchName}`);
              sentCount++;
            }
          }
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      sent: sentCount,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
