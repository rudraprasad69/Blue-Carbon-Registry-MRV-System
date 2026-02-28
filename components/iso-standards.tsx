"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Check, X } from "lucide-react"

const isoStandards = [
  { id: "iso-1", name: "ISO 14064-1: Greenhouse gases — Part 1", checked: true },
  { id: "iso-2", name: "ISO 14064-2: Greenhouse gases — Part 2", checked: true },
  { id: "iso-3", name: "ISO 14064-3: Greenhouse gases — Part 3", checked: false },
  { id: "iso-4", name: "ISO 14040: Environmental management — Life cycle assessment", checked: true },
];

export function IsoStandards() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ISO-Aligned Validation Standards</CardTitle>
        <CardDescription>
          Ensuring our projects meet international standards for quantification, monitoring, and reporting of greenhouse gas emissions reductions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {isoStandards.map(standard => (
            <li key={standard.id} className="flex items-center p-2 border rounded-md">
              {standard.checked ? <Check className="text-green-500 mr-2" /> : <X className="text-red-500 mr-2" />}
              <span>{standard.name}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
