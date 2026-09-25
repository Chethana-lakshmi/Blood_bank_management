import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, PlusCircle, Search, Clock, CheckCircle2, AlertTriangle, FileText, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import requestService from '../../services/requestService';
import hospitalService from '../../services/hospitalService';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function HospitalDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [hospitalInfo, setHospitalInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let hospRes;
        try {
          hospRes = await hospitalService.getMyProfile();
        } catch {
          hospRes = await hospitalService.getHospitalById(user?._id || user?.id);
        }
        if (hospRes?.data?.data) {
          const d = hospRes.data.data;
          setHospitalInfo(d.hospital || d);
        }
        const reqRes = await requestService.getHospitalRequests();
        if (reqRes?.data?.data) {
          const raw = reqRes.data.data;
          setRequests(Array.isArray(raw) ? raw : (raw.requests || []));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  if (loading) return <div className="h-64 bg-gray-200 animate-pulse rounded-2xl" />;

  const reqList = Array.isArray(requests) ? requests : [];
  const pendingCount = reqList.filter(r => r.status === 'PENDING').length;
  const approvedCount = reqList.filter(r => r.status === 'APPROVED').length;
  const completedCount = reqList.filter(r => r.status === 'COMPLETED').length;
  const emergencyCount = reqList.filter(r => r.urgency === 'EMERGENCY').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">Hospital Management</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">{user?.name}</h1>
          <p className="text-red-100 text-sm">License: {hospitalInfo?.licenseNumber || 'Verified'}</p>
        </div>
        <Link to="/hospital/request-blood" className="w-full sm:w-auto">
          <Button variant="secondary" size="md" className="w-full bg-white text-red-600 hover:bg-red-50 flex items-center justify-center gap-2 font-bold">
            <PlusCircle className="w-5 h-5" /> New Blood Request
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 block font-medium">Pending Requests</span>
            <span className="text-2xl font-black text-gray-900">{pendingCount}</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 block font-medium">Approved</span>
            <span className="text-2xl font-black text-gray-900">{approvedCount}</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 block font-medium">Completed</span>
            <span className="text-2xl font-black text-gray-900">{completedCount}</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xs text-gray-500 block font-medium">Emergency</span>
            <span className="text-2xl font-black text-gray-900">{emergencyCount}</span>
          </div>
        </Card>
      </div>

      {/* Recent Requests Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent Blood Requests</h2>
          <Link to="/hospital/requests" className="text-xs font-semibold text-red-600 hover:underline">
            View All ({requests.length})
          </Link>
        </div>

        {requests.length === 0 ? (
          <Card className="text-center py-8 text-gray-500">
            No blood requests submitted yet. Click "New Blood Request" to create one.
          </Card>
        ) : (
          <div className="space-y-3">
            {requests.slice(0, 5).map((req) => (
              <Card key={req._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 font-extrabold text-lg flex items-center justify-center shrink-0">
                    {req.bloodGroup}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                      Patient: {req.patientName}
                      {req.urgency === 'EMERGENCY' && (
                        <span className="bg-red-100 text-red-700 text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                          EMERGENCY
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {req.unitsRequired} Units required by {new Date(req.requiredDate).toLocaleDateString()}
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
                    <Button variant="outline" size="sm">Details</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
