// lib/satellite-imagery-service.ts

export interface SatelliteImageData {
  id: string;
  projectId: string;
  imageUrl: string;
  timestamp: string;
  provider: 'Google Earth Engine' | 'Copernicus';
  resolution: string; // e.g., '10m'
}

const mockSatelliteImages: SatelliteImageData[] = [
  {
    id: 'img1',
    projectId: 'proj1',
    imageUrl: 'https://placehold.co/800x600/000000/FFFFFF/png?text=Sat-Image-1',
    timestamp: new Date('2026-03-15T10:30:00Z').toISOString(),
    provider: 'Google Earth Engine',
    resolution: '10m',
  },
  {
    id: 'img2',
    projectId: 'proj1',
    imageUrl: 'https://placehold.co/800x600/000000/FFFFFF/png?text=Sat-Image-2',
    timestamp: new Date('2026-03-20T11:00:00Z').toISOString(),
    provider: 'Copernicus',
    resolution: '20m',
  },
  {
    id: 'img3',
    projectId: 'proj2',
    imageUrl: 'https://placehold.co/800x600/000000/FFFFFF/png?text=Sat-Image-3',
    timestamp: new Date('2026-03-22T09:00:00Z').toISOString(),
    provider: 'Google Earth Engine',
    resolution: '10m',
  },
];

export const fetchSatelliteImages = async (
  projectId: string
): Promise<SatelliteImageData[]> => {
  console.log(`Fetching satellite images for project ${projectId}...`);
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const images = mockSatelliteImages.filter(
    (image) => image.projectId === projectId
  );

  console.log(`Found ${images.length} images for project ${projectId}.`);
  return images;
};
