import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * RouteGuard component to manage page-level access permissions.
 * Target Rule: Blocks regular USER accounts from entering the /deleted-items panel.
 */
const RouteGuard = ({ userType, children }) => {
  
  // Requirement: Redirect regular USER accounts back to the main /products page
  if (userType === 'USER') {
    return <Navigate to="/products" replace />;
  }

  // Allow full entry if userType is ADMIN or SUPERADMIN
  return children;
};

export default RouteGuard;q1