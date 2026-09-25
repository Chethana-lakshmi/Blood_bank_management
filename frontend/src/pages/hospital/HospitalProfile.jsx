import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, ShieldCheck, MapPin, Edit3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import hospitalService from '../../services/hospitalService';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function HospitalProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await hospitalService.getHospitalById(user?._id || user?.id);
        if (res.data?.data) {
          setProfile(res.data.data);
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

  const p = profile || {};

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-gray-900">Hospital Profile</h1>
        <Link to="/hospital/profile/edit">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Edit3 className="w-4 h-4" /> Edit Profile
          </Button>
        </Link>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 pb-6 border-b border-gray-100 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-red-100 text-red-600 font-extrabold flex items-center justify-center shrink-0">
            <Building2 className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Badge variant={p.verificationStatus === 'VERIFIED' ? 'success' : 'warning'}>
                {p.verificationStatus || 'VERIFIED'}
              </Badge>
              <span className="text-xs text-gray-500 font-medium">License: {p.licenseNumber}</span>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase">Hospital Email</span>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
              <Mail className="w-4 h-4 text-red-500" /> {user?.email}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase">Contact Phone</span>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
              <Phone className="w-4 h-4 text-red-500" /> {p.phone || 'Not provided'}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase">License Registration</span>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
              <ShieldCheck className="w-4 h-4 text-red-500" /> {p.licenseNumber || 'N/A'}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase">Full Address</span>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
              <MapPin className="w-4 h-4 text-red-500" />
              {p.address ? `${p.address}, ${p.city}, ${p.state}` : `${p.city || 'City'}, ${p.state || 'State'}`}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
