import { NextRequest } from 'next/server'
import { createHandler, handleGetUsers, handleCreateUser } from '@/lib/api-integration'

export const GET = createHandler(async (req: NextRequest) => {
  return handleGetUsers(req)
})

export const POST = createHandler(async (req: NextRequest) => {
  return handleCreateUser(req)
})
