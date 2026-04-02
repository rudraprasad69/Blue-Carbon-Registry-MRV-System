// components/satellite-imagery-viewer.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  fetchSatelliteImages,
  SatelliteImageData,
} from '@/lib/satellite-imagery-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const SatelliteImageryViewer = () => {
  const [images, setImages] = useState<SatelliteImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState('proj1');

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      const fetchedImages = await fetchSatelliteImages(selectedProjectId);
      setImages(fetchedImages);
      setLoading(false);
    };

    loadImages();
  }, [selectedProjectId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Satellite Imagery Viewer</CardTitle>
        <div className="pt-4">
          <label htmlFor="project-select" className="block text-sm font-medium text-gray-700">
            Select Project
          </label>
          <Select onValueChange={setSelectedProjectId} defaultValue={selectedProjectId}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="proj1">Project 1</SelectItem>
              <SelectItem value="proj2">Project 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading images...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((image) => (
              <Card key={image.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{image.provider}</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={image.imageUrl}
                    alt={`Satellite image for project ${image.projectId}`}
                    className="w-full h-auto rounded-lg"
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Timestamp: {new Date(image.timestamp).toLocaleString()}</p>
                    <p>Resolution: {image.resolution}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SatelliteImageryViewer;
