import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Clock, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import requestService from '../../services/requestService';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function HospitalRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await requestService.getHospitalRequests();
        if (res.data?.data) {
          setRequests(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const filteredRequests = statusFilter === 'ALL'
    ? requests
    : requests.filter(r => r.status === statusFilter);

  if (loading) return <div className="h-64 bg-gray-200 animate-pulse rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Hospital Blood Requests</h1>
          <p className="text-sm text-gray-500">Track and manage all submitted blood requirements</p>
        </div>
        <Link to="/hospital/request-blood">
          <Button className="flex items-center gap-2 shadow-sm">
            <PlusCircle className="w-4 h-4" /> New Blood Request
          </Button>
        </Link>
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

      {filteredRequests.length === 0 ? (
        <Card className="text-center py-10 text-gray-500">
          No blood requests found for this filter.
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((req) => (
            <Card key={req._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 font-black text-xl flex items-center justify-center shrink-0">
                  {req.bloodGroup}
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-gray-900 text-base flex items-center gap-2">
                    Patient: {req.patientName}
                    {req.urgency === 'EMERGENCY' && (
                      <span className="bg-red-100 text-red-700 text-[10px] font-black px-2.5 py-0.5 rounded-full animate-pulse">
                        EMERGENCY
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 flex flex-wrap items-center gap-3">
                    <span>{req.unitsRequired} Units Required</span>
                    <span>•</span>
                    <span>Date: {new Date(req.requiredDate).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Reason: {req.reason}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <Badge variant={
                  req.status === 'APPROVED' ? 'success' :
                  req.status === 'PENDING' ? 'warning' :
                  req.status === 'COMPLETED' ? 'info' : 'danger'
                }>
                  {req.status}
                </Badge>
                <Link to={`/hospital/requests/${req._id}`}>
                  <Button variant="outline" size="sm">View Status</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
