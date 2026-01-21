import { NextRequest } from 'next/server'
import { createHandler, handleGetPriceHistory } from '@/lib/api-integration'

export const GET = createHandler(async (req: NextRequest) => {
  return handleGetPriceHistory(req)
})
