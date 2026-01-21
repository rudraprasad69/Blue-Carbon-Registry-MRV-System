import { NextRequest } from 'next/server'
import { createHandler, handleGetRankings } from '@/lib/api-integration'

export const GET = createHandler(async (req: NextRequest) => {
  return handleGetRankings(req)
})
