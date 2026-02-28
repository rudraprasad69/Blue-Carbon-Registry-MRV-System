"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const buyOrders = [
  { price: 15.2, quantity: 1000 },
  { price: 15.1, quantity: 500 },
  { price: 15.0, quantity: 2000 },
];

const sellOrders = [
  { price: 15.3, quantity: 800 },
  { price: 15.4, quantity: 1200 },
  { price: 15.5, quantity: 300 },
];

export function OrderMatching() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Matching System</CardTitle>
        <CardDescription>
            A transparent and efficient order matching engine.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <h4 className="font-semibold mb-2 text-green-600">Buy Orders</h4>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Price (USD)</TableHead>
                        <TableHead>Quantity</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {buyOrders.map((order, i) => (
                        <TableRow key={i}>
                            <TableCell>{order.price.toFixed(2)}</TableCell>
                            <TableCell>{order.quantity}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
        <div>
            <h4 className="font-semibold mb-2 text-red-600">Sell Orders</h4>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Price (USD)</TableHead>
                        <TableHead>Quantity</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sellOrders.map((order, i) => (
                        <TableRow key={i}>
                            <TableCell>{order.price.toFixed(2)}</TableCell>
                            <TableCell>{order.quantity}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  )
}
