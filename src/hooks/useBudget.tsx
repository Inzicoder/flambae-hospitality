
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useWedding } from './useWedding';
import { useToast } from '@/hooks/use-toast';

export interface BudgetCategory {
  id: string;
  wedding_id: string;
  name: string;
  estimated_amount: number;
  actual_amount: number;
  status: 'pending' | 'partial' | 'paid';
  created_at: string;
}

export const useBudget = () => {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { wedding } = useWedding();
  const { toast } = useToast();

  useEffect(() => {
    if (wedding) {
      fetchBudgetCategories();
    } else {
      setLoading(false);
    }
  }, [wedding]);

  const fetchBudgetCategories = async () => {
    if (!wedding) return;

    try {
      const { data, error } = await supabase
        .from('budget_categories')
        .select('*')
        .eq('wedding_id', wedding.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCategories((data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'partial' | 'paid'
      })));
    } catch (error: any) {
      console.error('Error fetching budget categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (categoryData: Omit<BudgetCategory, 'id' | 'wedding_id' | 'created_at'>) => {
    if (!wedding) return;

    try {
      const { data, error } = await supabase
        .from('budget_categories')
        .insert([{ ...categoryData, wedding_id: wedding.id }])
        .select()
        .single();

      if (error) throw error;
      
      setCategories(prev => [{
        ...data,
        status: data.status as 'pending' | 'partial' | 'paid'
      }, ...prev]);
      toast({
        title: "Success!",
        description: "Budget category added successfully.",
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

  const updateCategory = async (id: string, categoryData: Partial<BudgetCategory>) => {
    try {
      const { data, error } = await supabase
        .from('budget_categories')
        .update(categoryData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setCategories(prev => prev.map(cat => cat.id === id ? {
        ...data,
        status: data.status as 'pending' | 'partial' | 'paid'
      } : cat));
      toast({
        title: "Success!",
        description: "Budget category updated successfully.",
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
    categories,
    loading,
    addCategory,
    updateCategory,
    fetchBudgetCategories
  };
};
