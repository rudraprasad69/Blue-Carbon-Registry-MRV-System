import { NextRequest } from 'next/server'
import { createHandler, handleGetTimeSeries } from '@/lib/api-integration'

export const GET = createHandler(async (req: NextRequest) => {
  return handleGetTimeSeries(req)
})
