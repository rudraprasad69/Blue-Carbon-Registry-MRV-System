import { NextRequest } from 'next/server'
import { createHandler, handleGetPrediction } from '@/lib/api-integration'

export const GET = createHandler(async (req: NextRequest) => {
  return handleGetPrediction(req)
})
