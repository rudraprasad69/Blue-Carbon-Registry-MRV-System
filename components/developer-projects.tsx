"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { mockDeveloperProjects } from "@/lib/mock-data"
import { MapPin, CheckCircle, AlertCircle } from "lucide-react"

export function DeveloperProjects() {
  return (
    <div className="space-y-4">
      {mockDeveloperProjects.map((project) => (
        <Card key={project.id} className="border-border hover:border-accent/50 transition-colors">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Project Info */}
              <div>
                <h3 className="font-bold text-lg text-foreground mb-2">{project.projectName}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{project.location}</span>
                </div>
                <Badge className="bg-accent/20 text-accent">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2 inline-block"></span>
                  {project.status}
                </Badge>
              </div>

              {/* Credits Status */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Credit Status</p>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground font-semibold">{project.creditsVerified}</span>
                      <span className="text-muted-foreground">Verified</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <AlertCircle className="w-3 h-3 text-yellow-500" />
                    <span className="text-muted-foreground">{project.creditsPending} pending audit</span>
                  </div>
                </div>
              </div>

              {/* Generation Metrics */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Generation & Area</p>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Monthly: </span>
                    <span className="font-semibold text-accent">{project.monthlyGeneration}</span>
                    <span className="text-muted-foreground"> credits/mo</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Area: </span>
                    <span className="font-semibold text-foreground">{project.areaUnderManagement}</span>
                    <span className="text-muted-foreground"> ha</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CO₂ Total: </span>
                    <span className="font-semibold text-green-600">{project.co2SequesteredTotal}</span>
                    <span className="text-muted-foreground"> t</span>
                  </div>
                </div>
              </div>

              {/* Verification Progress */}
              <div>
                <p className="text-xs text-muted-foreground mb-3">Verification Progress</p>
                <div className="flex flex-col gap-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-foreground">{project.verificationProgress}%</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <Progress value={project.verificationProgress} className="h-2" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Next Audit: {new Date(project.nextAuditDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
