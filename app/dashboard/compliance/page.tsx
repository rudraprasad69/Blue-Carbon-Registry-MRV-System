// app/dashboard/compliance/page.tsx

import AuditTrailViewer from '@/components/audit-trail-viewer';

const CompliancePage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Compliance & Auditing</h1>
      <p className="mb-6 text-gray-600">
        Review all system and user activities for compliance and auditing purposes.
      </p>
      <AuditTrailViewer />
    </div>
  );
};

export default CompliancePage;
