
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  user_type: 'guest' | 'eventCompany';
  company_name: string | null;
  created_at: string;
  updated_at: string;
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      console.log('Fetching profile for user:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        // If profile doesn't exist, create a default one
        const userType = user.user_metadata?.user_type || 'guest';
        console.log('Creating new profile with user_type:', userType);
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            email: user.email,
            user_type: userType,
            company_name: user.user_metadata?.company_name || null
          }])
          .select()
          .single();
        
        if (createError) {
          console.error('Error creating profile:', createError);
          throw createError;
        }
        console.log('New profile created:', newProfile);
        setProfile(newProfile as UserProfile);
      } else {
        console.log('Profile fetched:', data);
        setProfile(data as UserProfile);
      }
    } catch (error: any) {
      console.error('Error with profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    fetchProfile
  };
};
