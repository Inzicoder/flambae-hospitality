
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useWedding } from './useWedding';
import { useToast } from '@/hooks/use-toast';

export interface Guest {
  id: string;
  wedding_id: string;
  full_name: string;
  email: string | null;
  phone_number: string | null;
  attendance_status: 'confirmed' | 'declined' | 'pending';
  plus_one: boolean;
  dietary_restrictions: string | null;
  created_at: string;
}

export const useGuests = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const { wedding } = useWedding();
  const { toast } = useToast();

  useEffect(() => {
    if (wedding) {
      fetchGuests();
    } else {
      setLoading(false);
    }
  }, [wedding]);

  const fetchGuests = async () => {
    if (!wedding) return;

    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('wedding_id', wedding.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGuests((data || []).map(item => ({
        ...item,
        attendance_status: item.attendance_status as 'confirmed' | 'declined' | 'pending'
      })));
    } catch (error: any) {
      console.error('Error fetching guests:', error);
    } finally {
      setLoading(false);
    }
  };

  const addGuest = async (guestData: Omit<Guest, 'id' | 'wedding_id' | 'created_at'>) => {
    if (!wedding) return;

    try {
      const { data, error } = await supabase
        .from('guests')
        .insert([{ ...guestData, wedding_id: wedding.id }])
        .select()
        .single();

      if (error) throw error;
      
      setGuests(prev => [{
        ...data,
        attendance_status: data.attendance_status as 'confirmed' | 'declined' | 'pending'
      }, ...prev]);
      toast({
        title: "Success!",
        description: "Guest added successfully.",
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

  const updateGuest = async (id: string, guestData: Partial<Guest>) => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .update(guestData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setGuests(prev => prev.map(guest => guest.id === id ? {
        ...data,
        attendance_status: data.attendance_status as 'confirmed' | 'declined' | 'pending'
      } : guest));
      toast({
        title: "Success!",
        description: "Guest updated successfully.",
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

  const deleteGuest = async (id: string) => {
    try {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setGuests(prev => prev.filter(guest => guest.id !== id));
      toast({
        title: "Success!",
        description: "Guest deleted successfully.",
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };

  return {
    guests,
    loading,
    addGuest,
    updateGuest,
    deleteGuest,
    fetchGuests
  };
};
