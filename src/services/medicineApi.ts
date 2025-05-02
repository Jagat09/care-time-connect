
import { supabase } from "@/integrations/supabase/client";
import { Medicine } from "../types/medicine";

export async function getMedicines(): Promise<Medicine[]> {
  try {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .order('name');
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching medicines:', error);
    throw error;
  }
}

export async function getMedicineById(id: string): Promise<Medicine | null> {
  try {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching medicine:', error);
    throw error;
  }
}

export async function createMedicine(medicine: Omit<Medicine, 'id' | 'created_at'>) {
  try {
    const { data, error } = await supabase
      .from('medicines')
      .insert([medicine])
      .select();
      
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating medicine:', error);
    throw error;
  }
}

export async function updateMedicine(id: string, medicine: Partial<Omit<Medicine, 'id' | 'created_at'>>) {
  try {
    const { data, error } = await supabase
      .from('medicines')
      .update(medicine)
      .eq('id', id)
      .select();
      
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating medicine:', error);
    throw error;
  }
}

export async function deleteMedicine(id: string) {
  try {
    const { error } = await supabase
      .from('medicines')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting medicine:', error);
    throw error;
  }
}
