-- Add email_reminders_enabled to profiles table
ALTER TABLE public.profiles 
ADD COLUMN email_reminders_enabled BOOLEAN DEFAULT TRUE;

-- Update existing profiles to have reminders enabled by default
UPDATE public.profiles 
SET email_reminders_enabled = TRUE 
WHERE email_reminders_enabled IS NULL;

-- Update the handle_new_user trigger to read from raw_user_meta_data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email_reminders_enabled)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    COALESCE((new.raw_user_meta_data->>'email_reminders_enabled')::boolean, TRUE)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
