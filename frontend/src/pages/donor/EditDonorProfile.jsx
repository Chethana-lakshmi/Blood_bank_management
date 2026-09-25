import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import donorService from '../../services/donorService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function EditDonorProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [donorId, setDonorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let res;
        try {
          res = await donorService.getMyProfile();
        } catch {
          res = await donorService.getDonorById(user?._id || user?.id);
        }
        if (res?.data?.data) {
          const d = res.data.data;
          const p = d.donor || d;
          setDonorId(p._id);
          reset({
            phone: p.phone || '',
            bloodGroup: p.bloodGroup || 'O+',
            gender: p.gender || 'MALE',
            address: p.address || '',
            city: p.city || '',
            state: p.state || '',
            pincode: p.pincode || '',
            availabilityStatus: p.availabilityStatus || 'AVAILABLE'
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProfile();
  }, [user, reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    setError('');
    try {
      await donorService.updateDonor(donorId, data);
      navigate('/donor/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-64 bg-gray-200 animate-pulse rounded-2xl" />;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-extrabold text-gray-900">Edit Donor Profile</h1>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm font-medium">{error}</div>
      )}

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Phone Number</label>
              <input
                type="text"
                {...register('phone', { required: true })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Blood Group</label>
              <select
                {...register('bloodGroup')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Gender</label>
              <select
                {...register('gender')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Availability</label>
              <select
                {...register('availabilityStatus')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="UNAVAILABLE">UNAVAILABLE</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Street Address</label>
            <input
              type="text"
              {...register('address')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">City</label>
              <input
                type="text"
                {...register('city')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">State</label>
              <input
                type="text"
                {...register('state')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Pincode</label>
              <input
                type="text"
                {...register('pincode')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={saving} className="flex-1">Save Profile</Button>
            <Button type="button" variant="outline" onClick={() => navigate('/donor/profile')}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
