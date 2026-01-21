import { NextRequest } from 'next/server'
import { createHandler, handleGetSeasonalAnalysis } from '@/lib/api-integration'

export const GET = createHandler(async (req: NextRequest) => {
  return handleGetSeasonalAnalysis(req)
})
