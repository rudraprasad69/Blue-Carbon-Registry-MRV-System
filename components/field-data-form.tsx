"use client"

import { useState } from "react"
import { useGeolocation } from "@/hooks/use-geolocation"
import { useOfflineSync } from "@/hooks/use-offline-sync"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, MapPin, Compass, WifiOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

export function FieldDataForm({ onFormSubmit }: { onFormSubmit: () => void }) {
  const { latitude, longitude, error: geoError, loading: geoLoading, getGeolocation } = useGeolocation()
  const { isOffline, saveOfflineData } = useOfflineSync()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      // For offline, we might want to handle files differently, e.g., store in IndexedDB.
      // For now, we'll just keep the file info.
      setSelectedFile(event.target.files[0])
    }
  }
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())
    
    // Add additional data
    data.latitude = latitude ?? ''
    data.longitude = longitude ?? ''
    data.timestamp = new Date().toISOString()
    if (selectedFile) {
      data.fileName = selectedFile.name
      // In a real offline scenario, you'd convert the file to a storable format (e.g., base64)
    }

    if (isOffline) {
      saveOfflineData(data)
      setIsSubmitting(false)
      toast({
        title: "You're Offline",
        description: "Data has been saved locally. It will be synced automatically when you're back online.",
      })
      onFormSubmit()
      return
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    toast({
      title: "Data Submitted",
      description: "Your field data has been successfully uploaded.",
    })
    onFormSubmit()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Submit New Field Data</CardTitle>
        {isOffline && (
          <Badge variant="destructive" className="flex items-center gap-2">
            <WifiOff className="h-4 w-4" />
            Offline Mode
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input name="projectName" id="projectName" placeholder="e.g., Seagrass Restoration" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input name="location" id="location" placeholder="e.g., Coastal Area 5" required />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label>GPS Coordinates</Label>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" onClick={getGeolocation} disabled={geoLoading}>
                {geoLoading ? <Compass className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
                Get Location
              </Button>
              <div className="text-sm text-muted-foreground">
                {latitude && longitude ? `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` : "No location captured"}
              </div>
            </div>
            {geoError && <p className="text-sm text-red-500">{geoError}</p>}
          </div>

          <div className="space-y-2">
            <Label>Measurements</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border rounded-md">
              <div className="space-y-2">
                <Label htmlFor="waterTemp" className="text-xs">Water Temp (°C)</Label>
                <Input name="waterTemp" id="waterTemp" type="number" step="0.1" placeholder="25.5" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salinity" className="text-xs">Salinity (ppt)</Label>
                <Input name="salinity" id="salinity" type="number" step="0.1" placeholder="35.2" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phLevel" className="text-xs">pH Level</Label>
                <Input name="phLevel" id="phLevel" type="number" step="0.1" placeholder="8.1" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="biodiversity" className="text-xs">Species Count</Label>
                <Input name="biodiversity" id="biodiversity" type="number" placeholder="15" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Field Notes</Label>
            <Textarea name="notes" id="notes" placeholder="Observations about the site..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Upload Photo/Scan</Label>
            <div className="flex items-center gap-2">
                <Input id="photo" type="file" onChange={handleFileChange} className="w-full" />
                <Button type="button" variant="ghost" size="icon" disabled={!selectedFile} onClick={() => setSelectedFile(null)}>
                    <Upload className="h-5 w-5" />
                </Button>
            </div>
            {selectedFile && <p className="text-sm text-muted-foreground">File: {selectedFile.name}</p>}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onFormSubmit}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : (isOffline ? "Save Offline" : "Submit Data")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
