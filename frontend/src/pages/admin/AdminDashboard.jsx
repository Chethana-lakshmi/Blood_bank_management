import React, { useEffect, useState } from 'react';
import { Users, Building2, Droplet, Clock, AlertTriangle, Activity, PlusCircle, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, PieChart, Pie } from 'recharts';
import adminService from '../../services/adminService';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function AdminDashboard() {
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await adminService.getDashboard();
        if (res.data?.data) {
          setDashData(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="h-96 bg-gray-200 animate-pulse rounded-2xl" />;

  const data = dashData || {
    totalDonors: 120,
    totalHospitals: 45,
    totalBloodUnits: 450,
    totalDonations: 380,
    pendingRequests: 8,
    emergencyRequests: 3,
    stockByGroup: [
      { bloodGroup: 'A+', unitsAvailable: 85 },
      { bloodGroup: 'A-', unitsAvailable: 30 },
      { bloodGroup: 'B+', unitsAvailable: 95 },
      { bloodGroup: 'B-', unitsAvailable: 25 },
      { bloodGroup: 'AB+', unitsAvailable: 40 },
      { bloodGroup: 'AB-', unitsAvailable: 15 },
      { bloodGroup: 'O+', unitsAvailable: 120 },
      { bloodGroup: 'O-', unitsAvailable: 40 }
    ],
    monthlyDonations: [
      { month: 'May', count: 45 },
      { month: 'Jun', count: 52 },
      { month: 'Jul', count: 68 },
      { month: 'Aug', count: 74 },
      { month: 'Sep', count: 89 }
    ]
  };

  const COLORS = ['#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#9333ea', '#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">System Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Live operational overview of blood reserves, requests, and network metrics</p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="flex flex-col items-center justify-center text-center p-4">
          <Users className="w-6 h-6 text-red-600 mb-1" />
          <span className="text-2xl font-black text-gray-900">{data.totalDonors}</span>
          <span className="text-xs text-gray-500">Total Donors</span>
        </Card>

        <Card className="flex flex-col items-center justify-center text-center p-4">
          <Building2 className="w-6 h-6 text-blue-600 mb-1" />
          <span className="text-2xl font-black text-gray-900">{data.totalHospitals}</span>
          <span className="text-xs text-gray-500">Hospitals</span>
        </Card>

        <Card className="flex flex-col items-center justify-center text-center p-4">
          <Droplet className="w-6 h-6 text-red-600 mb-1 fill-current" />
          <span className="text-2xl font-black text-gray-900">{data.totalBloodUnits}</span>
          <span className="text-xs text-gray-500">Blood Units</span>
        </Card>

        <Card className="flex flex-col items-center justify-center text-center p-4">
          <Activity className="w-6 h-6 text-emerald-600 mb-1" />
          <span className="text-2xl font-black text-gray-900">{data.totalDonations}</span>
          <span className="text-xs text-gray-500">Total Donations</span>
        </Card>

        <Card className="flex flex-col items-center justify-center text-center p-4">
          <Clock className="w-6 h-6 text-amber-600 mb-1" />
          <span className="text-2xl font-black text-gray-900">{data.pendingRequests}</span>
          <span className="text-xs text-gray-500">Pending Requests</span>
        </Card>

        <Card className="flex flex-col items-center justify-center text-center p-4 bg-red-50/50 border-red-100">
          <AlertTriangle className="w-6 h-6 text-red-600 mb-1 animate-pulse" />
          <span className="text-2xl font-black text-red-700">{data.emergencyRequests}</span>
          <span className="text-xs text-red-600 font-semibold">Emergency</span>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Blood Stock Chart */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900 text-base">Blood Group Reserves (Units)</h2>
            <span className="text-xs text-gray-400">Real-time units</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.stockByGroup || []}>
                <XAxis dataKey="bloodGroup" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'rgba(239, 68, 68, 0.05)' }} />
                <Bar dataKey="unitsAvailable" radius={[6, 6, 0, 0]}>
                  {(data.stockByGroup || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Monthly Donations Trend */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900 text-base">Monthly Donation Growth</h2>
            <span className="text-xs text-gray-400">Past 5 Months</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthlyDonations || []}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#e11d48" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
