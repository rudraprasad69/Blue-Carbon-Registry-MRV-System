"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, RefreshCw, FileText } from "lucide-react"

export function Article6Integration() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Article 6 Mechanism Integration</CardTitle>
        <CardDescription>
          Facilitating the transfer of Internationally Transferred Mitigation Outcomes (ITMOs)
          under the Paris Agreement.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center p-8 bg-muted rounded-lg">
          <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold">Connect to the Global Carbon Market</h3>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Our platform is being updated to support Article 6 of the Paris Agreement. This will allow for the authorized international transfer of carbon credits and help countries meet their Nationally Determined Contributions (NDCs).
          </p>
          <Button variant="outline" className="mt-6">Learn More About Article 6</Button>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Simulated ITMO Transfer</h4>
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">Transfer from <span className="text-primary">Country A</span> to <span className="text-accent">Country B</span></p>
                <p className="text-sm text-muted-foreground">Status: Pending Authorization</p>
              </div>
              <Button size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Check Status
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                    <p className="text-muted-foreground">Credits</p>
                    <p className="font-semibold">10,000 tCO₂e</p>
                </div>
                <div>
                    <p className="text-muted-foreground">Project</p>
                    <p className="font-semibold">Blue Carbon Mangrove Restoration</p>
                </div>
                <div>
                    <p className="text-muted-foreground">Corresponding Adjustment</p>
                    <p className="font-semibold">Required</p>
                </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileText className="w-4 h-4" />
                <span>Documentation submitted for bilateral agreement.</span>
            </div>

          </div>
        </div>
      </CardContent>
    </Card>
  )
}
