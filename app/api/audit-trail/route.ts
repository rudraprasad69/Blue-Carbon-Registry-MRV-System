import { NextResponse } from 'next/server';
import { mockAuditLogs } from '@/lib/mock-audit-data';

export async function GET() {
  // In a real application, you would fetch this from a database.
  // We'll add a short delay to simulate network latency.
  await new Promise(resolve => setTimeout(resolve, 500));

  return NextResponse.json(mockAuditLogs);
}
