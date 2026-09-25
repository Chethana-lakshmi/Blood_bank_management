import React, { useEffect, useState } from 'react';
import { Search, Heart, Trash2, MapPin, Phone } from 'lucide-react';
import donorService from '../../services/donorService';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function AdminDonors() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDonors = async () => {
    try {
      const res = await donorService.getAllDonors();
      if (res.data?.data) {
        setDonors(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this donor?')) return;
    try {
      await donorService.deleteDonor(id);
      fetchDonors();
    } catch (err) {
      alert('Failed to delete donor');
    }
  };

  const filteredDonors = donors.filter(d =>
    d.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.bloodGroup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="h-64 bg-gray-200 animate-pulse rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Manage Voluntary Donors</h1>
          <p className="text-sm text-gray-500">Registered donors database and availability status</p>
        </div>
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search name, blood group, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
          />
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-4">Donor Name</th>
                <th className="px-6 py-4">Blood Group</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Donations</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDonors.map((d) => (
                <tr key={d._id} className="hover:bg-gray-50/50 transition-all">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{d.user?.name || 'Donor'}</div>
                    <div className="text-xs text-gray-500">{d.user?.email} • {d.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-lg bg-red-100 text-red-700 font-extrabold text-xs">
                      {d.bloodGroup}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-600">
                    {d.city}, {d.state}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={d.availabilityStatus === 'AVAILABLE' ? 'success' : 'warning'}>
                      {d.availabilityStatus}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">{d.donationCount || 0}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(d._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Delete Donor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
