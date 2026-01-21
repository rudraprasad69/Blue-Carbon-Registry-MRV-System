import { NextRequest } from 'next/server'
import { createHandler, handleCompareProjects } from '@/lib/api-integration'

export const GET = createHandler(async (req: NextRequest) => {
  return handleCompareProjects(req)
})
