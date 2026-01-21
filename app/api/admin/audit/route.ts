import { NextRequest } from 'next/server'
import { createHandler, handleGetAuditLogs } from '@/lib/api-integration'

export const GET = createHandler(async (req: NextRequest) => {
  return handleGetAuditLogs(req)
})
