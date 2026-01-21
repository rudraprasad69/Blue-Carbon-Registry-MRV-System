import { NextRequest } from 'next/server'
import { createHandler, handleExport } from '@/lib/api-integration'

export const POST = createHandler(async (req: NextRequest) => {
  return handleExport(req)
})
