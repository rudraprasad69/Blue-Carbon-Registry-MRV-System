import { createHandler, handleGetMarketMetrics } from '@/lib/api-integration'

export const GET = createHandler(handleGetMarketMetrics)
