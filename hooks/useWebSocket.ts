'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface WebSocketMessage {
  type: string
  data?: any
  error?: string
  timestamp: string
  [key: string]: any 
}

interface UseWebSocketOptions {
  url?: string
  autoConnect?: boolean
  reconnectAttempts?: number
  reconnectInterval?: number
}

/**
 * Hook for managing WebSocket connections to Carbon Registry server
 * 
 * @example
 * const ws = useWebSocket()
 * 
 * // Subscribe to channels
 * useEffect(() => {
 *   ws.subscribe(['price_updates', 'market_metrics'])
 * }, [ws])
 * 
 * // Listen to messages
 * useEffect(() => {
 *   const unsubscribe = ws.onMessage((msg) => {
 *     if (msg.type === 'price_update') {
 *       setPrice(msg.data)
 *     }
 *   })
 *   return unsubscribe
 * }, [ws])
 */
export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    url = (() => {
      if (typeof window === 'undefined') return 'ws://localhost:3001'
      return window.location.hostname === 'localhost'
        ? 'ws://localhost:3001'
        : `wss://${window.location.host}/ws`
    })(),
    autoConnect = true,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
  } = options

  const wsRef = useRef<WebSocket | null>(null)
  const messageListenersRef = useRef<Set<(msg: WebSocketMessage) => void>>(new Set())
  const [isConnected, setIsConnected] = useState(false)
  const [clientId, setClientId] = useState<string | null>(null)
  const reconnectCountRef = useRef(0)

  // Connect to WebSocket server
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    try {
      const ws = new WebSocket(url)

      ws.onopen = () => {
        console.log('WebSocket connected')
        setIsConnected(true)
        reconnectCountRef.current = 0
      }

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          
          // Extract client ID from connection message
          if (message.type === 'connection_established') {
            setClientId(message.clientId)
          }

          // Notify all listeners
          messageListenersRef.current.forEach((listener) => listener(message))
        } catch (error) {
          console.error('Failed to parse message:', error)
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
      }

      ws.onclose = () => {
        console.log('WebSocket closed')
        setIsConnected(false)
        
        // Attempt reconnection
        if (reconnectCountRef.current < reconnectAttempts) {
          reconnectCountRef.current++
          console.log(`Reconnecting... (${reconnectCountRef.current}/${reconnectAttempts})`)
          setTimeout(connect, reconnectInterval)
        }
      }

      wsRef.current = ws
    } catch (error) {
      console.error('Failed to create WebSocket:', error)
    }
  }, [url, reconnectAttempts, reconnectInterval])

  // Disconnect from server
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
      setIsConnected(false)
    }
  }, [])

  // Send message to server
  const send = useCallback((message: any) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected')
      return false
    }

    try {
      wsRef.current.send(JSON.stringify(message))
      return true
    } catch (error) {
      console.error('Failed to send message:', error)
      return false
    }
  }, [])

  // Subscribe to channels
  const subscribe = useCallback((channels: string[]) => {
    return send({
      action: 'subscribe',
      channels,
    })
  }, [send])

  // Unsubscribe from channels
  const unsubscribe = useCallback((channels: string[]) => {
    return send({
      action: 'unsubscribe',
      channels,
    })
  }, [send])

  // Request current price
  const getCurrentPrice = useCallback(() => {
    return send({
      action: 'get_current_price',
    })
  }, [send])

  // Request market metrics
  const getMarketMetrics = useCallback(() => {
    return send({
      action: 'get_market_metrics',
    })
  }, [send])

  // Request prediction
  const getPrediction = useCallback((projectId: string, metric: string) => {
    return send({
      action: 'get_prediction',
      projectId,
      metric,
    })
  }, [send])

  // Place order
  const placeOrder = useCallback((orderData: any) => {
    return send({
      action: 'place_order',
      orderData,
    })
  }, [send])

  // Send heartbeat
  const sendHeartbeat = useCallback(() => {
    return send({
      action: 'heartbeat',
    })
  }, [send])

  // Listen to messages
  const onMessage = useCallback((listener: (msg: WebSocketMessage) => void) => {
    messageListenersRef.current.add(listener)
    
    // Return unsubscribe function
    return () => {
      messageListenersRef.current.delete(listener)
    }
  }, [])

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [autoConnect, connect, disconnect])

  // Send heartbeat periodically
  useEffect(() => {
    if (!isConnected) return

    const heartbeatInterval = setInterval(() => {
      sendHeartbeat()
    }, 30000) // Every 30 seconds

    return () => clearInterval(heartbeatInterval)
  }, [isConnected, sendHeartbeat])

  return {
    isConnected,
    clientId,
    connect,
    disconnect,
    send,
    subscribe,
    unsubscribe,
    getCurrentPrice,
    getMarketMetrics,
    getPrediction,
    placeOrder,
    onMessage,
  }
}

/**
 * Example usage component
 * 
 * export function LivePriceTicker() {
 *   const ws = useWebSocket()
 *   const [price, setPrice] = useState<number | null>(null)
 * 
 *   // Subscribe on connect
 *   useEffect(() => {
 *     if (ws.isConnected) {
 *       ws.subscribe(['price_updates'])
 *     }
 *   }, [ws.isConnected, ws])
 * 
 *   // Listen for price updates
 *   useEffect(() => {
 *     const unsubscribe = ws.onMessage((msg) => {
 *       if (msg.type === 'price_update') {
 *         setPrice(msg.data.priceUSD)
 *       }
 *     })
 *     return unsubscribe
 *   }, [ws])
 * 
 *   return (
 *     <div>
 *       <h2>Current Price</h2>
 *       <p>${price ? price.toFixed(2) : 'Loading...'}</p>
 *       <p>{ws.isConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>
 *     </div>
 *   )
 * }
 */
