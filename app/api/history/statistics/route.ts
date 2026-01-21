import { NextRequest } from 'next/server'
import { createHandler, handleGetStatistics } from '@/lib/api-integration'

export const GET = createHandler(async (req: NextRequest) => {
  return handleGetStatistics(req)
})
