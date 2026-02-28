/**
 * Real-time WebSocket Server for Carbon Registry
 * Provides live market data, price updates, and notifications
 * 
 * Usage:
 * - Start server: node lib/websocket-server.js
 * - Connect client: ws://localhost:3001
 */

import { WebSocketServer, WebSocket } from 'ws'
import { getCarbonMarketService } from './carbon-market-service'
import { getHistoricalService } from './historical-analysis-service'

interface ClientSubscription {
  clientId: string
  channels: Set<string>
  lastHeartbeat: number
}

interface MarketUpdate {
  type: 'price_update' | 'order_executed' | 'market_metrics' | 'prediction_update'
  data: any
  timestamp: string
}

class CarbonRegistryWebSocketServer {
  private wss: WebSocketServer | null = null
  private clients: Map<string, ClientSubscription> = new Map()
  private updateInterval: NodeJS.Timeout | null = null
  private marketService = getCarbonMarketService()
  private historicalService = getHistoricalService()

  constructor(port: number = 3001) {
    this.wss = new WebSocketServer({ port })
    this.setupServer()
    console.log(`WebSocket server starting on ws://localhost:${port}`)
  }

  private setupServer() {
    if (!this.wss) return

    this.wss.on('connection', (ws: WebSocket) => {
      const clientId = this.generateClientId()
      console.log(`Client connected: ${clientId}`)

      const subscription: ClientSubscription = {
        clientId,
        channels: new Set(),
        lastHeartbeat: Date.now(),
      }

      this.clients.set(clientId, subscription)

      // Handle incoming messages
      ws.on('message', (message: string) => {
        try {
          const msg = JSON.parse(message)
          this.handleClientMessage(ws, clientId, msg)
        } catch (error) {
          console.error('Invalid message format:', error)
          ws.send(JSON.stringify({ error: 'Invalid message format' }))
        }
      })

      // Handle client disconnect
      ws.on('close', () => {
        console.log(`Client disconnected: ${clientId}`)
        this.clients.delete(clientId)
      })

      // Handle errors
      ws.on('error', (error: Error) => {
        console.error(`WebSocket error for ${clientId}:`, error)
      })

      // Send welcome message
      this.sendToClient(ws, {
        type: 'connection_established',
        clientId,
        supportedChannels: ['price_updates', 'market_metrics', 'predictions', 'orders', 'alerts'],
      })
    })

    // Start broadcasting market updates
    this.startMarketBroadcast()
  }

  private handleClientMessage(ws: WebSocket, clientId: string, message: any) {
    const subscription = this.clients.get(clientId)
    if (!subscription) return

    switch (message.action) {
      case 'subscribe':
        this.handleSubscribe(ws, clientId, message.channels)
        break
      case 'unsubscribe':
        this.handleUnsubscribe(clientId, message.channels)
        break
      case 'get_current_price':
        this.handleGetCurrentPrice(ws)
        break
      case 'get_market_metrics':
        this.handleGetMarketMetrics(ws)
        break
      case 'get_prediction':
        this.handleGetPrediction(ws, message.projectId, message.metric)
        break
      case 'place_order':
        this.handlePlaceOrder(ws, clientId, message.orderData)
        break
      case 'heartbeat':
        subscription.lastHeartbeat = Date.now()
        this.sendToClient(ws, { type: 'heartbeat_ack' })
        break
      default:
        console.warn(`Unknown action: ${message.action}`)
    }
  }

  private handleSubscribe(ws: WebSocket, clientId: string, channels: string[]) {
    const subscription = this.clients.get(clientId)
    if (!subscription) return

    channels.forEach((channel) => subscription.channels.add(channel))

    this.sendToClient(ws, {
      type: 'subscription_confirmed',
      channels: Array.from(subscription.channels),
    })

    console.log(`Client ${clientId} subscribed to: ${channels.join(', ')}`)
  }

  private handleUnsubscribe(clientId: string, channels: string[]) {
    const subscription = this.clients.get(clientId)
    if (!subscription) return

    channels.forEach((channel) => subscription.channels.delete(channel))
    console.log(`Client ${clientId} unsubscribed from: ${channels.join(', ')}`)
  }

  private handleGetCurrentPrice(ws: WebSocket) {
    const price = this.marketService.getCurrentPrice()
    this.sendToClient(ws, {
      type: 'price_data',
      data: price,
    })
  }

  private handleGetMarketMetrics(ws: WebSocket) {
    const metrics = this.marketService.getMarketMetrics()
    this.sendToClient(ws, {
      type: 'market_metrics',
      data: metrics,
    })
  }

  private handleGetPrediction(ws: WebSocket, projectId: string, metric: string) {
    const prediction = this.historicalService.predictTrend(projectId, metric as any, 90)
    this.sendToClient(ws, {
      type: 'prediction_data',
      projectId,
      metric,
      data: prediction,
    })
  }

  private handlePlaceOrder(ws: WebSocket, clientId: string, orderData: any) {
    try {
      const order = this.marketService.placeOrder(orderData)
      
      // Broadcast to all interested clients
      this.broadcastToChannel('orders', {
        type: 'order_executed',
        data: order,
        initiatorClientId: clientId,
      })

      this.sendToClient(ws, {
        type: 'order_confirmation',
        data: order,
      })
    } catch (error) {
      this.sendToClient(ws, {
        type: 'order_error',
        error: error instanceof Error ? error.message : 'Order placement failed',
      })
    }
  }

  private startMarketBroadcast() {
    // Broadcast market updates every 30 seconds
    this.updateInterval = setInterval(() => {
      const priceUpdate: MarketUpdate = {
        type: 'price_update',
        data: this.marketService.getCurrentPrice(),
        timestamp: new Date().toISOString(),
      }

      const metricsUpdate: MarketUpdate = {
        type: 'market_metrics',
        data: this.marketService.getMarketMetrics(),
        timestamp: new Date().toISOString(),
      }

      this.broadcastToChannel('price_updates', priceUpdate)
      this.broadcastToChannel('market_metrics', metricsUpdate)
    }, 30000)
  }

  private broadcastToChannel(channel: string, message: any) {
    this.clients.forEach((subscription, clientId) => {
      if (subscription.channels.has(channel)) {
        const client = this.getClientWebSocket(clientId)
        if (client && client.readyState === WebSocket.OPEN) {
          this.sendToClient(client, message)
        }
      }
    })
  }

  private sendToClient(ws: WebSocket, message: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        ...message,
        timestamp: new Date().toISOString(),
      }))
    }
  }

  private getClientWebSocket(clientId: string): WebSocket | null {
    for (const client of this.wss?.clients || []) {
      if (client.readyState === WebSocket.OPEN) {
        // In production, maintain a proper mapping
        return client as WebSocket
      }
    }
    return null
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  public stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }
    if (this.wss) {
      this.wss.close()
      console.log('WebSocket server stopped')
    }
  }

  public getClientCount(): number {
    return this.clients.size
  }

  public getStatistics() {
    return {
      connectedClients: this.clients.size,
      subscriptions: Array.from(this.clients.values()).reduce(
        (acc, client) => acc + client.channels.size,
        0
      ),
      uptime: process.uptime(),
    }
  }
}

// Export singleton
let wsServer: CarbonRegistryWebSocketServer | null = null

export function getWebSocketServer(): CarbonRegistryWebSocketServer {
  if (!wsServer) {
    wsServer = new CarbonRegistryWebSocketServer(3001)
  }
  return wsServer
}

export function stopWebSocketServer() {
  if (wsServer) {
    wsServer.stop()
    wsServer = null
  }
}

/**
 * Example Client Implementation
 * 
 * // Browser client
 * const ws = new WebSocket('ws://localhost:3001')
 * 
 * ws.onopen = () => {
 *   // Subscribe to price updates
 *   ws.send(JSON.stringify({
 *     action: 'subscribe',
 *     channels: ['price_updates', 'market_metrics']
 *   }))
 * }
 * 
 * ws.onmessage = (event) => {
 *   const message = JSON.parse(event.data)
 *   console.log('Update:', message)
 *   
 *   if (message.type === 'price_update') {
 *     updateUI(message.data)
 *   }
 * }
 * 
 * // Place an order
 * ws.send(JSON.stringify({
 *   action: 'place_order',
 *   orderData: {
 *     projectId: 'project-001',
 *     type: 'buy',
 *     quantity: 100,
 *     pricePerUnit: 25.50
 *   }
 * }))
 * 
 * // Get current metrics
 * ws.send(JSON.stringify({
 *   action: 'get_current_price'
 * }))
 * 
 * ws.onclose = () => {
 *   console.log('Connection closed')
 * }
 */
