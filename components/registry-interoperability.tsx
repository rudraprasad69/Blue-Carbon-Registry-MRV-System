"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GitMerge, Zap } from "lucide-react"

export function RegistryInteroperability() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>International Registry Interoperability</CardTitle>
        <CardDescription>
          Connecting with global carbon registries for seamless credit transfer and data sharing.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center p-8 bg-muted rounded-lg">
          <GitMerge className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold">Seamless Cross-Registry Communication</h3>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            We are building connections to major international carbon registries. This will prevent double-counting and allow for the fluid transfer of assets across different platforms, enhancing market liquidity and trust.
          </p>
          <Button variant="outline" className="mt-6">View Connected Registries</Button>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Simulated Cross-Registry Sync</h4>
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">Sync with <span className="text-primary">Verra Registry</span></p>
                <p className="text-sm text-muted-foreground">Status: Connected</p>
              </div>
              <Button size="sm">
                <Zap className="w-4 h-4 mr-2" />
                Initiate Sync
              </Button>
            </div>
             <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                    <p className="text-muted-foreground">Last Sync</p>
                    <p className="font-semibold">2 hours ago</p>
                </div>
                <div>
                    <p className="text-muted-foreground">Credits Watched</p>
                    <p className="font-semibold">1,500,000</p>
                </div>
                <div>
                    <p className="text-muted-foreground">Sync Health</p>
                    <p className="font-semibold text-green-600">Healthy</p>
                </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
