import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Calendar, Award, Activity, Bell, ToggleLeft, ToggleRight, User, History } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import donorService from '../../services/donorService';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function DonorDashboard() {
  const { user } = useAuth();
  const [donorProfile, setDonorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    const fetchDonorProfile = async () => {
      try {
        let res;
        try {
          res = await donorService.getMyProfile();
        } catch {
          res = await donorService.getDonorById(user?._id || user?.id);
        }
        if (res?.data?.data) {
          const d = res.data.data;
          setDonorProfile(d.donor || d);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchDonorProfile();
  }, [user]);

  const handleToggleAvailability = async () => {
    if (!donorProfile?._id) return;
    setToggling(true);
    const newStatus = donorProfile.availabilityStatus === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE';
    try {
      const res = await donorService.updateAvailability(donorProfile._id, newStatus);
      if (res?.data?.data) {
        const d = res.data.data;
        setDonorProfile(prev => ({ ...prev, ...(d.donor || d), availabilityStatus: newStatus }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-4"><div className="h-28 bg-gray-200 rounded-2xl" /><div className="h-64 bg-gray-200 rounded-2xl" /></div>;
  }

  const profile = donorProfile || {};
  const isAvailable = profile.availabilityStatus === 'AVAILABLE';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">Donor Portal</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Welcome back, {user?.name}!</h1>
          <p className="text-red-100 text-sm">Thank you for being a vital life-saver in our emergency network.</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <div>
            <div className="text-xs text-red-200">Current Status</div>
            <div className="font-bold text-base flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${isAvailable ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              {profile.availabilityStatus || 'AVAILABLE'}
            </div>
          </div>
          <Button
            variant={isAvailable ? 'outline' : 'secondary'}
            size="sm"
            onClick={handleToggleAvailability}
            loading={toggling}
            className="bg-white text-red-600 hover:bg-red-50 border-0"
          >
            {isAvailable ? <ToggleRight className="w-5 h-5 text-emerald-600" /> : <ToggleLeft className="w-5 h-5" />}
            Toggle
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <span className="text-xs text-gray-500 block font-medium">Blood Group</span>
            <span className="text-2xl font-black text-gray-900">{profile.bloodGroup || 'O+'}</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 block font-medium">Donation Count</span>
            <span className="text-2xl font-black text-gray-900">{profile.donationCount || 0}</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 block font-medium">Last Donation</span>
            <span className="text-sm font-bold text-gray-900">
              {profile.lastDonationDate ? new Date(profile.lastDonationDate).toLocaleDateString() : 'Never'}
            </span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 block font-medium">Status</span>
            <Badge variant={isAvailable ? 'success' : 'warning'}>
              {profile.availabilityStatus || 'AVAILABLE'}
            </Badge>
          </div>
        </Card>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link to="/donor/profile">
          <Card className="hover:border-red-200 transition-all flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-red-600" />
              <div>
                <div className="font-bold text-gray-900 text-sm">My Profile</div>
                <div className="text-xs text-gray-500">View and update details</div>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/donor/donations">
          <Card className="hover:border-red-200 transition-all flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-red-600" />
              <div>
                <div className="font-bold text-gray-900 text-sm">Donation History</div>
                <div className="text-xs text-gray-500">Track all past donations</div>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/donor/notifications">
          <Card className="hover:border-red-200 transition-all flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-red-600" />
              <div>
                <div className="font-bold text-gray-900 text-sm">Notifications</div>
                <div className="text-xs text-gray-500">Alerts & requests</div>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
