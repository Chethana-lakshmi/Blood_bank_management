import React, { useEffect, useState } from 'react';
import { Building2, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import hospitalService from '../../services/hospitalService';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function AdminHospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHospitals = async () => {
    try {
      const res = await hospitalService.getAllHospitals();
      if (res.data?.data) {
        setHospitals(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleVerification = async (id, status) => {
    try {
      await hospitalService.updateVerificationStatus(id, status);
      fetchHospitals();
    } catch (err) {
      alert('Failed to update hospital status');
    }
  };

  if (loading) return <div className="h-64 bg-gray-200 animate-pulse rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Manage Hospitals</h1>
        <p className="text-sm text-gray-500">Verify hospital licenses and manage medical partner accounts</p>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-4">Hospital</th>
                <th className="px-6 py-4">License Number</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Verification</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {hospitals.map((h) => (
                <tr key={h._id} className="hover:bg-gray-50/50 transition-all">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{h.user?.name || h.hospitalName}</div>
                    <div className="text-xs text-gray-500">{h.user?.email} • {h.phone}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-700">
                    {h.licenseNumber}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-600">
                    {h.city}, {h.state}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={h.verificationStatus === 'VERIFIED' ? 'success' : h.verificationStatus === 'REJECTED' ? 'danger' : 'warning'}>
                      {h.verificationStatus}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {h.verificationStatus !== 'VERIFIED' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleVerification(h._id, 'VERIFIED')}
                        className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-0"
                      >
                        Verify
                      </Button>
                    )}
                    {h.verificationStatus !== 'REJECTED' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleVerification(h._id, 'REJECTED')}
                        className="text-red-600 hover:bg-red-50"
                      >
                        Reject
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
