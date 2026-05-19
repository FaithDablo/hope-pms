/**
 * HOPE PMS — Security & Regression Audit Logger (Sprint 3)
 * Nagtatala ng system access gating at permission blocks para sa compliance.
 */
export const logSecurityEvent = (actionType, userEmail, status) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event_id: `SEC-${Math.floor(100000 + Math.random() * 900000)}`,
    action: actionType, // Halimbawa: 'SIDEBAR_GATING', 'SUPERADMIN_BLOCK'
    user: userEmail || 'Anonymous/Unauthenticated',
    result: status, // 'ALLOWED' o 'BLOCKED'
    system_version: 'v2.0.26-prod'
  };

  // I-oout natin ito sa console para sa simulation tracking ng team niyo
  console.log(`[SECURITY AUDIT] [${logEntry.result}] ${logEntry.action} by ${logEntry.user} at ${logEntry.timestamp}`);
  
  return logEntry;
};