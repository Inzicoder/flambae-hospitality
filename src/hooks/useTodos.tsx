
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useWedding } from './useWedding';
import { useToast } from '@/hooks/use-toast';

export interface Todo {
  id: string;
  wedding_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  urgent: boolean;
  due_date: string | null;
  created_at: string;
}

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const { wedding } = useWedding();
  const { toast } = useToast();

  useEffect(() => {
    if (wedding) {
      fetchTodos();
    } else {
      setLoading(false);
    }
  }, [wedding]);

  const fetchTodos = async () => {
    if (!wedding) return;

    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('wedding_id', wedding.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTodos(data || []);
    } catch (error: any) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (todoData: Omit<Todo, 'id' | 'wedding_id' | 'created_at'>) => {
    if (!wedding) return;

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ ...todoData, wedding_id: wedding.id }])
        .select()
        .single();

      if (error) throw error;
      
      setTodos(prev => [data, ...prev]);
      toast({
        title: "Success!",
        description: "Task added successfully.",
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

  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
      const { data, error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setTodos(prev => prev.map(t => t.id === id ? data : t));
      
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

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTodos(prev => prev.filter(todo => todo.id !== id));
      toast({
        title: "Success!",
        description: "Task deleted successfully.",
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
    todos,
    loading,
    addTodo,
    toggleTodo,
    deleteTodo,
    fetchTodos
  };
};
