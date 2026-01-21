import { createHandler, handleGetMarketPrice } from '@/lib/api-integration'

export const GET = createHandler(handleGetMarketPrice)
