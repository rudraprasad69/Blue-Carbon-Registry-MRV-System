'use client'

import { useEffect, useState } from 'react'
import { MarketAnalyticsDashboard } from '@/components/market-analytics-dashboard'
import { Button } from '@/components/ui/button'

interface OrderForm {
  projectId: string
  type: 'buy' | 'sell'
  quantity: number
  pricePerUnit: number
}

export default function MarketPage() {
  const [orders, setOrders] = useState<OrderForm[]>([])
  const [formData, setFormData] = useState<OrderForm>({
    projectId: '',
    type: 'buy',
    quantity: 100,
    pricePerUnit: 25,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handlePlaceOrder = async () => {
    if (!formData.projectId) {
      alert('Please enter a project ID')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/market/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const result = await response.json()
      if (result.success) {
        setOrders([...orders, formData])
        setFormData({ projectId: '', type: 'buy', quantity: 100, pricePerUnit: 25 })
        alert(`Order placed successfully for ${formData.quantity} credits`)
      }
    } catch (error) {
      console.error('Order placement failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-900 to-slate-900 p-6 space-y-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Carbon Credit Market</h1>
        <p className="text-green-300">Buy and sell verified carbon credits in real-time</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-3 gap-6">
        {/* Market Analytics */}
        <div className="col-span-2">
          <div className="bg-slate-800/40 backdrop-blur border border-green-500/20 rounded-lg p-6">
            <MarketAnalyticsDashboard refreshInterval={15000} showPriceHistory={true} showVolume={true} />
          </div>
        </div>

        {/* Order Form */}
        <div className="bg-slate-800/40 backdrop-blur border border-green-500/20 rounded-lg p-6 h-fit">
          <h2 className="text-xl font-bold text-white mb-4">Place Order</h2>
          <div className="space-y-4">
            <div>
              <label className="text-green-300 text-sm font-medium">Project ID</label>
              <input
                type="text"
                placeholder="project-001"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-slate-900 border border-green-500/30 rounded text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="text-green-300 text-sm font-medium">Order Type</label>
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => setFormData({ ...formData, type: 'buy' })}
                  className={`flex-1 py-2 px-3 rounded font-medium transition ${
                    formData.type === 'buy'
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setFormData({ ...formData, type: 'sell' })}
                  className={`flex-1 py-2 px-3 rounded font-medium transition ${
                    formData.type === 'sell'
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  Sell
                </button>
              </div>
            </div>

            <div>
              <label className="text-green-300 text-sm font-medium">Quantity</label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                className="w-full mt-1 px-3 py-2 bg-slate-900 border border-green-500/30 rounded text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="text-green-300 text-sm font-medium">Price per Unit</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={formData.pricePerUnit}
                onChange={(e) => setFormData({ ...formData, pricePerUnit: parseFloat(e.target.value) })}
                className="w-full mt-1 px-3 py-2 bg-slate-900 border border-green-500/30 rounded text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
              />
            </div>

            <div className="bg-slate-900/50 rounded p-3">
              <p className="text-gray-300 text-sm mb-2">Total Value</p>
              <p className="text-2xl font-bold text-green-400">${(formData.quantity * formData.pricePerUnit).toFixed(2)}</p>
            </div>

            <Button
              onClick={handlePlaceOrder}
              disabled={isLoading}
              className={`w-full py-2 font-bold rounded transition ${
                formData.type === 'buy'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isLoading ? 'Processing...' : `${formData.type === 'buy' ? 'Buy' : 'Sell'} Credits`}
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      {orders.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-800/40 backdrop-blur border border-green-500/20 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Recent Orders</h2>
            <div className="space-y-2">
              {orders.map((order, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-slate-900/40 rounded border border-green-500/10">
                  <div>
                    <p className="text-white font-medium">{order.type.toUpperCase()} - {order.projectId}</p>
                    <p className="text-green-300 text-sm">{order.quantity} credits @ ${order.pricePerUnit}</p>
                  </div>
                  <p className="text-green-400 font-bold">${(order.quantity * order.pricePerUnit).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
