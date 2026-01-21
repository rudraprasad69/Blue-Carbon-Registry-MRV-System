"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockCommunityProjects } from "@/lib/mock-data"
import { Users, Leaf } from "lucide-react"

export function CommunityProjects() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Active Community Projects</h2>
        <p className="text-muted-foreground mt-1">Explore community initiatives and beneficiary programs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockCommunityProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{project.projectName}</CardTitle>
                  <CardDescription>{project.location}</CardDescription>
                </div>
                <span className="text-3xl">{project.image}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Community Size</p>
                    <p className="font-semibold">{project.communitySize.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Beneficiaries</p>
                    <p className="font-semibold">{project.beneficiaries.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted-foreground capitalize">{project.ecosystem}</span>
              </div>
              <div className="pt-3 border-t border-border">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100/20 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                  {project.status}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
