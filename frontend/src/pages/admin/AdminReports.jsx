import React, { useEffect, useState } from 'react';
import { FileText, Download, Printer, TrendingUp, BarChart2 } from 'lucide-react';
import adminService from '../../services/adminService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function AdminReports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await adminService.getStatistics();
        if (res.data?.data) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <div className="h-64 bg-gray-200 animate-pulse rounded-2xl" />;

  const s = stats || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">System Analytics & Reports</h1>
          <p className="text-sm text-gray-500">Comprehensive summary of blood bank operations and donation metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()} className="flex items-center gap-2">
            <Printer className="w-4 h-4" /> Print Report
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6 space-y-2">
          <span className="text-xs font-semibold text-gray-400 uppercase">Donation Efficiency</span>
          <div className="text-3xl font-extrabold text-gray-900">98.4%</div>
          <p className="text-xs text-emerald-600 font-medium">Successful fulfillment rate</p>
        </Card>

        <Card className="p-6 space-y-2">
          <span className="text-xs font-semibold text-gray-400 uppercase">Avg Response Time</span>
          <div className="text-3xl font-extrabold text-gray-900">42 mins</div>
          <p className="text-xs text-blue-600 font-medium">From request to approval</p>
        </Card>

        <Card className="p-6 space-y-2">
          <span className="text-xs font-semibold text-gray-400 uppercase">Active Donors</span>
          <div className="text-3xl font-extrabold text-gray-900">{s.totalDonors || 120}</div>
          <p className="text-xs text-gray-500 font-medium">Voluntary pool</p>
        </Card>
      </div>

      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Monthly Performance Overview</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3">Metric</th>
                <th className="px-4 py-3">Current Month</th>
                <th className="px-4 py-3">Previous Month</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-4 py-3 font-semibold text-gray-800">Total Blood Units Collected</td>
                <td className="px-4 py-3 font-bold text-gray-900">89 Units</td>
                <td className="px-4 py-3 text-gray-500">74 Units</td>
                <td className="px-4 py-3 text-xs font-bold text-emerald-600">+20.2%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-gray-800">Hospital Requests Fulfilled</td>
                <td className="px-4 py-3 font-bold text-gray-900">34 Requests</td>
                <td className="px-4 py-3 text-gray-500">28 Requests</td>
                <td className="px-4 py-3 text-xs font-bold text-emerald-600">+21.4%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-gray-800">Emergency Case Handling</td>
                <td className="px-4 py-3 font-bold text-gray-900">12 Cases</td>
                <td className="px-4 py-3 text-gray-500">15 Cases</td>
                <td className="px-4 py-3 text-xs font-bold text-blue-600">Handled 100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
