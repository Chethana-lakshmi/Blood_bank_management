import React, { useEffect, useState } from 'react';
import { PlusCircle, Droplet, Calendar, User, MapPin } from 'lucide-react';
import donationService from '../../services/donationService';
import donorService from '../../services/donorService';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function AdminDonations() {
  const [donations, setDonations] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [recording, setRecording] = useState(false);

  const [formData, setFormData] = useState({
    donorId: '',
    bloodGroup: 'O+',
    unitsDonated: 1,
    donationDate: new Date().toISOString().split('T')[0],
    location: 'Central Blood Bank',
    notes: ''
  });

  const fetchData = async () => {
    try {
      const donRes = await donationService.getAllDonations();
      if (donRes.data?.data) setDonations(donRes.data.data);
      const donorRes = await donorService.getAllDonors();
      if (donorRes.data?.data) setDonors(donorRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRecordDonation = async (e) => {
    e.preventDefault();
    if (!formData.donorId) {
      alert('Please select a donor');
      return;
    }
    setRecording(true);
    try {
      await donationService.recordDonation(formData);
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to record donation');
    } finally {
      setRecording(false);
    }
  };

  if (loading) return <div className="h-64 bg-gray-200 animate-pulse rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Donation Management</h1>
          <p className="text-sm text-gray-500">Record new voluntary blood donations and update inventory</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4" /> Record New Donation
        </Button>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-4">Donor</th>
                <th className="px-6 py-4">Blood Group</th>
                <th className="px-6 py-4">Units</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {donations.map((d) => (
                <tr key={d._id} className="hover:bg-gray-50/50 transition-all">
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {d.donor?.user?.name || 'Registered Donor'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-lg bg-red-100 text-red-700 font-extrabold text-xs">
                      {d.bloodGroup}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">{d.unitsDonated} Unit(s)</td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {new Date(d.donationDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-600">{d.location || 'Blood Bank'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Record Donation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">Record Voluntary Donation</h3>

            <form onSubmit={handleRecordDonation} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Select Donor</label>
                <select
                  value={formData.donorId}
                  onChange={(e) => {
                    const selected = donors.find(d => d._id === e.target.value);
                    setFormData({
                      ...formData,
                      donorId: e.target.value,
                      bloodGroup: selected ? selected.bloodGroup : formData.bloodGroup
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                >
                  <option value="">Select a donor from database</option>
                  {donors.map(d => (
                    <option key={d._id} value={d._id}>
                      {d.user?.name} ({d.bloodGroup}) - {d.city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Blood Group</label>
                  <input
                    type="text"
                    value={formData.bloodGroup}
                    readOnly
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Units Donated</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.unitsDonated}
                    onChange={(e) => setFormData({ ...formData, unitsDonated: parseInt(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Location / Camp</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" loading={recording} className="flex-1">Record & Add Stock</Button>
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
