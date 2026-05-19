'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface League {
  id: string;
  name: string;
  join_code: string | null;
  created_by: string;
}

export interface LeagueMember {
  id: string;
  league_id: string;
  user_id: string;
  role: 'admin' | 'member';
  status: 'pending' | 'approved' | 'rejected';
  leagues: League;
}

interface LeagueContextType {
  activeLeague: League | null;
  setActiveLeague: (league: League | null) => void;
  userLeagues: LeagueMember[];
  loading: boolean;
  refreshLeagues: () => Promise<void>;
}

const LeagueContext = createContext<LeagueContextType | undefined>(undefined);

export function LeagueProvider({ children }: { children: React.ReactNode }) {
  const [activeLeague, setActiveLeague] = useState<League | null>(null);
  const [userLeagues, setUserLeagues] = useState<LeagueMember[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const refreshLeagues = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('league_members')
      .select('*, leagues(*)')
      .eq('user_id', user.id)
      .eq('status', 'approved');

    if (error) {
      console.error('Error fetching leagues:', error);
    } else if (data) {
      setUserLeagues(data as any);
      
      // Auto-select active league if not set or not in the list anymore
      if (data.length > 0) {
        if (!activeLeague || !data.find(l => l.league_id === activeLeague.id)) {
          // Check local storage first
          const savedId = localStorage.getItem('activeLeagueId');
          const savedLeague = savedId ? data.find(l => l.league_id === savedId) : null;
          
          if (savedLeague) {
            setActiveLeague(savedLeague.leagues as any);
          } else {
            setActiveLeague(data[0].leagues as any);
          }
        }
      } else {
        setActiveLeague(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshLeagues();
  }, []);

  // Save to localStorage when active league changes
  useEffect(() => {
    if (activeLeague) {
      localStorage.setItem('activeLeagueId', activeLeague.id);
    } else {
      localStorage.removeItem('activeLeagueId');
    }
  }, [activeLeague]);

  return (
    <LeagueContext.Provider value={{ activeLeague, setActiveLeague, userLeagues, loading, refreshLeagues }}>
      {children}
    </LeagueContext.Provider>
  );
}

export function useLeague() {
  const context = useContext(LeagueContext);
  if (context === undefined) {
    throw new Error('useLeague must be used within a LeagueProvider');
  }
  return context;
}
