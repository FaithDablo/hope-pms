import { supabase } from '../supabaseClient';

/**
 * Fetch products based on the logged-in account's userType.
 * Requirement: USER role only gets 'ACTIVE' records. ADMIN/SUPERADMIN gets everything.
 */
export const getProducts = async (userType) => {
  let query = supabase.from('product').select('*');
  
  // If userType is strictly 'USER', enforce the soft-delete filter to show ACTIVE rows only
  if (userType === 'USER') {
    query = query.eq('record_status', 'ACTIVE');
  }
  
  const { data, error } = await query.order('product_id', { ascending: true });
  if (error) throw error;
  return data;
};

/**
 * Add a brand new product to the database.
 * Default record_status is always 'ACTIVE'.
 */
export const addProduct = async (productData) => {
  const { data, error } = await supabase
    .from('product')
    .insert([{ ...productData, record_status: 'ACTIVE' }]); 
  if (error) throw error;
  return data;
};

/**
 * Update an existing product's details (Edit Form).
 */
export const updateProduct = async (productId, updatedData) => {
  const { data, error } = await supabase
    .from('product')
    .update(updatedData)
    .eq('product_id', productId);
  if (error) throw error;
  return data;
};

/**
 * Soft Delete a product by setting its status to 'INACTIVE'.
 * This hides the product immediately from all USER accounts without hard-deleting it.
 */
export const softDeleteProduct = async (productId) => {
  const { data, error } = await supabase
    .from('product')
    .update({ record_status: 'INACTIVE' })
    .eq('product_id', productId);
  if (error) throw error;
  return data;
};

/**
 * Recover a soft-deleted product by restoring its status to 'ACTIVE'.
 * This makes the product visible again to everyone.
 */
export const recoverProduct = async (productId) => {
  const { data, error } = await supabase
    .from('product')
    .update({ record_status: 'ACTIVE' })
    .eq('product_id', productId);
  if (error) throw error;
  return data;
};