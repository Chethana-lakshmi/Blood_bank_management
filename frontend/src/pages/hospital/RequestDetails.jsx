import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle2, AlertTriangle, FileText, MapPin, Phone, User } from 'lucide-react';
import requestService from '../../services/requestService';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function RequestDetails() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await requestService.getRequestById(id);
        if (res.data?.data) {
          setRequest(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div className="h-64 bg-gray-200 animate-pulse rounded-2xl" />;
  if (!request) return <div className="text-center py-10 text-gray-500">Request details not found.</div>;

  const req = request;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Link to="/hospital/requests" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-red-600">
        <ArrowLeft className="w-4 h-4" /> Back to Requests
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Request Details</h1>
          <p className="text-sm text-gray-500">ID: {req._id}</p>
        </div>
        <Badge variant={
          req.status === 'APPROVED' ? 'success' :
          req.status === 'PENDING' ? 'warning' :
          req.status === 'COMPLETED' ? 'info' : 'danger'
        }>
          {req.status}
        </Badge>
      </div>

      <Card className="space-y-6 p-6">
        <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 font-extrabold text-2xl flex items-center justify-center shrink-0">
            {req.bloodGroup}
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900">Patient: {req.patientName}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{req.unitsRequired} Units Required</span>
              <span>•</span>
              <span className={`font-bold ${req.urgency === 'EMERGENCY' ? 'text-red-600 animate-pulse' : 'text-gray-700'}`}>
                Urgency: {req.urgency}
              </span>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 text-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase">Hospital</span>
            <div className="font-semibold text-gray-800">{req.hospital?.hospitalName || 'Your Hospital'}</div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase">Required Date</span>
            <div className="font-semibold text-gray-800">{new Date(req.requiredDate).toLocaleDateString()}</div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase">City</span>
            <div className="font-semibold text-gray-800">{req.city}</div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase">Emergency Contact</span>
            <div className="font-semibold text-gray-800">{req.contactNumber}</div>
          </div>

          <div className="sm:col-span-2 space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase">Medical Reason</span>
            <div className="p-3 bg-gray-50 rounded-xl text-gray-700">{req.reason}</div>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase">Status Timeline</h3>
          <div className="flex items-center justify-between relative max-w-md mx-auto">
            {['PENDING', 'APPROVED', 'COMPLETED'].map((step, idx) => {
              const isDone = (
                (step === 'PENDING') ||
                (step === 'APPROVED' && (req.status === 'APPROVED' || req.status === 'COMPLETED')) ||
                (step === 'COMPLETED' && req.status === 'COMPLETED')
              );
              return (
                <div key={step} className="flex flex-col items-center gap-1 z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    isDone ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {idx + 1}
                  </div>
                  <span className="text-[10px] font-bold text-gray-600">{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
