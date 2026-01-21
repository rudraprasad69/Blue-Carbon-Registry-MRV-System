import { createHandler, handleGetSystemMetrics } from '@/lib/api-integration'

export const GET = createHandler(handleGetSystemMetrics)
