// components/audit-trail-viewer.tsx
'use client';

import { useState, useEffect } from 'react';
import { getAuditLogs, AuditLog } from '@/lib/audit-trail-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const AuditTrailViewer = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      const fetchedLogs = await getAuditLogs(100); // Fetch last 100 logs
      setLogs(fetchedLogs);
      setLoading(false);
    };

    loadLogs();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Audit Trail</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading audit logs...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>
                    <pre className="text-xs">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AuditTrailViewer;
