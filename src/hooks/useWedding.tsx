
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Wedding {
  id: string;
  couple_names: string;
  wedding_date: string | null;
  venue: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useWedding = () => {
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchWedding();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchWedding = async () => {
    try {
      const { data, error } = await supabase
        .from('weddings')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      setWedding(data);
    } catch (error: any) {
      console.error('Error fetching wedding:', error);
    } finally {
      setLoading(false);
    }
  };

  const createWedding = async (weddingData: Partial<Wedding>) => {
    try {
      const { data, error } = await supabase
        .from('weddings')
        .insert([{ ...weddingData, user_id: user?.id }])
        .select()
        .single();

      if (error) throw error;
      
      setWedding(data);
      toast({
        title: "Success!",
        description: "Wedding details created successfully.",
      });
      
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const updateWedding = async (weddingData: Partial<Wedding>) => {
    if (!wedding) return;

    try {
      const { data, error } = await supabase
        .from('weddings')
        .update(weddingData)
        .eq('id', wedding.id)
        .select()
        .single();

      if (error) throw error;
      
      setWedding(data);
      toast({
        title: "Success!",
        description: "Wedding details updated successfully.",
      });
      
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  return {
    wedding,
    loading,
    createWedding,
    updateWedding,
    fetchWedding
  };
};
