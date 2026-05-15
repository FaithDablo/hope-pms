import { supabase } from '../supabaseClient';

/**
 * Fetch the price history records for a specific product.
 * Sorted to show the newest price changes first.
 */
export const getPriceHistory = async (productId) => {
  const { data, error } = await supabase
    .from('priceHist')
    .select('*')
    .eq('product_id', productId)
    .order('change_date', { ascending: false }); 
  if (error) throw error;
  return data;
};

/**
 * Add a new price log entry whenever a product's price gets changed or updated.
 */
export const addPriceEntry = async (productId, newPrice, stampText) => {
  const { data, error } = await supabase
    .from('priceHist')
    .insert([
      { 
        product_id: productId, 
        price: newPrice, 
        change_date: new Date().toISOString().split('T')[0], // Generates current date (YYYY-MM-DD)
        stamp: stampText
      }
    ]);
  if (error) throw error;
  return data;
};