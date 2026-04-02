// lib/audit-trail-service.ts

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string; // In a real app, this would be a user ID
  action: string;
  details: Record<string, any>;
}

// In-memory store for demonstration purposes.
// In a real application, this would be a database.
const auditLogs: AuditLog[] = [
  {
    id: 'log-001',
    timestamp: new Date('2026-03-30T10:00:00Z').toISOString(),
    user: 'admin@bluecarbon.com',
    action: 'SYSTEM_STARTUP',
    details: { success: true },
  },
  {
    id: 'log-002',
    timestamp: new Date('2026-03-30T10:05:00Z').toISOString(),
    user: 'user@bluecarbon.com',
    action: 'VIEW_DASHBOARD',
    details: { page: '/dashboard' },
  },
];

export const addAuditLog = async (
  user: string,
  action: string,
  details: Record<string, any>
): Promise<AuditLog> => {
  console.log(`Adding audit log for user ${user}, action ${action}`);
  const newLog: AuditLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    user,
    action,
    details,
  };
  auditLogs.unshift(newLog); // Add to the beginning of the array
  return newLog;
};

export const getAuditLogs = async (limit: number = 50): Promise<AuditLog[]> => {
  console.log(`Fetching last ${limit} audit logs.`);
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return auditLogs.slice(0, limit);
};
