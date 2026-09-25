import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Phone, Mail, MapPin, Heart, Calendar, ToggleLeft, ToggleRight, Edit3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import donorService from '../../services/donorService';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function DonorProfile() {
  const { user } = useAuth();
  const [donorProfile, setDonorProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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
          setDonorProfile(d.donor || d);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProfile();
  }, [user]);

  if (loading) return <div className="h-64 bg-gray-200 animate-pulse rounded-2xl" />;

  const p = donorProfile || {};
  const isAvailable = p.availabilityStatus === 'AVAILABLE';

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-gray-900">Donor Profile</h1>
        <Link to="/donor/profile/edit">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Edit3 className="w-4 h-4" /> Edit Profile
          </Button>
        </Link>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 pb-6 border-b border-gray-100 text-center sm:text-left">
          <div className="w-20 h-20 rounded-full bg-red-100 text-red-600 font-extrabold text-3xl flex items-center justify-center shadow-inner shrink-0">
            {p.bloodGroup || 'O+'}
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <Badge variant={isAvailable ? 'success' : 'warning'}>
                {p.availabilityStatus || 'AVAILABLE'}
              </Badge>
              <span className="text-xs text-gray-500 font-medium">• {p.donationCount || 0} Donations Made</span>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase">Email Address</span>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
              <Mail className="w-4 h-4 text-red-500" /> {user?.email}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase">Phone Number</span>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
              <Phone className="w-4 h-4 text-red-500" /> {p.phone || 'Not provided'}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase">Blood Group</span>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
              <Heart className="w-4 h-4 text-red-500 fill-current" /> {p.bloodGroup}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase">Gender</span>
            <div className="text-sm font-medium text-gray-800">{p.gender || 'Not specified'}</div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase">Location</span>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
              <MapPin className="w-4 h-4 text-red-500" /> {p.city}, {p.state} ({p.pincode})
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase">Last Donation Date</span>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
              <Calendar className="w-4 h-4 text-red-500" />
              {p.lastDonationDate ? new Date(p.lastDonationDate).toLocaleDateString() : 'Never'}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
