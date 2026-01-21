import { createHandler, handleGetProjects } from '@/lib/api-integration'

export const GET = createHandler(handleGetProjects)
