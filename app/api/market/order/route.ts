import { NextRequest } from 'next/server'
import { createHandler, handlePlaceOrder } from '@/lib/api-integration'

export const POST = createHandler(async (req: NextRequest) => {
  return handlePlaceOrder(req)
})
