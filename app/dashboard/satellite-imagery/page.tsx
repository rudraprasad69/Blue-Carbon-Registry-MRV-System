// app/dashboard/satellite-imagery/page.tsx

import SatelliteImageryViewer from '@/components/satellite-imagery-viewer';

const SatelliteImageryPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Advanced Monitoring: Satellite Imagery</h1>
      <SatelliteImageryViewer />
    </div>
  );
};

export default SatelliteImageryPage;
