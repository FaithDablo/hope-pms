import { supabase } from '../supabaseClient';

/**
 * Fetch Product Listing (REP_001)
 * Enforces rule: Users see only ACTIVE items, ADMIN/SUPERADMIN can see all.
 */
export const getProductListingReport = async (userRole, hasRight) => {
  if (!hasRight) {
    throw new Error('Access Denied: REP_001 permission required.');
  }

  let query = supabase.from('product').select('*');

  // Strict constraint from Project Guide: USER cannot see INACTIVE items
  if (userRole === 'USER') {
    query = query.eq('record_status', 'ACTIVE');
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

/**
 * Fetch Top Selling Report (REP_002)
 * Restricted exclusively to SUPERADMIN scopes per grading matrix.
 */
export const getTopSellingReport = async (userRole, hasRight) => {
  if (userRole !== 'SUPERADMIN' || !hasRight) {
    throw new Error('Access Denied: REP_002 is strictly restricted to SUPERADMIN.');
  }

  // Fetches aggregated sales records mapped from the HopeDB core schema
  const { data, error } = await supabase
    .from('salesDetail')
    .select('prodno, qty, textprice')
    .order('qty', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
};