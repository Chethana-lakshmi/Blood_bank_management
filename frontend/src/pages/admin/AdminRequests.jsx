import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle2, AlertTriangle, XCircle, Check } from 'lucide-react';
import requestService from '../../services/requestService';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchRequests = async () => {
    try {
      const res = await requestService.getAllRequests();
      if (res.data?.data) {
        setRequests(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await requestService.updateStatus(id, status);
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update request status');
    }
  };

  const filteredRequests = statusFilter === 'ALL'
    ? requests
    : requests.filter(r => r.status === statusFilter);

  if (loading) return <div className="h-64 bg-gray-200 animate-pulse rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Hospital Blood Requests</h1>
        <p className="text-sm text-gray-500">Approve, complete, or reject blood requests submitted by hospitals</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {['ALL', 'PENDING', 'APPROVED', 'COMPLETED', 'REJECTED'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              statusFilter === status
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-4">Hospital & Patient</th>
                <th className="px-6 py-4">Group</th>
                <th className="px-6 py-4">Units</th>
                <th className="px-6 py-4">Urgency</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.map((req) => (
                <tr key={req._id} className="hover:bg-gray-50/50 transition-all">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{req.hospital?.hospitalName || 'Hospital'}</div>
                    <div className="text-xs text-gray-500">Patient: {req.patientName} • {req.city}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-lg bg-red-100 text-red-700 font-extrabold text-xs">
                      {req.bloodGroup}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">{req.unitsRequired}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      req.urgency === 'EMERGENCY' ? 'bg-red-100 text-red-700 animate-pulse' :
                      req.urgency === 'URGENT' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {req.urgency}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={
                      req.status === 'APPROVED' ? 'success' :
                      req.status === 'PENDING' ? 'warning' :
                      req.status === 'COMPLETED' ? 'info' : 'danger'
                    }>
                      {req.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right space-x-1">
                    {req.status === 'PENDING' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(req._id, 'APPROVED')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2.5 py-1"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(req._id, 'REJECTED')}
                          className="text-red-600 hover:bg-red-50 text-xs px-2.5 py-1"
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {req.status === 'APPROVED' && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(req._id, 'COMPLETED')}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2.5 py-1"
                      >
                        Complete Request & Deduct Stock
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
