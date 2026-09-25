import React, { useEffect, useState } from 'react';
import { Calendar, Droplet, MapPin, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import donationService from '../../services/donationService';
import donorService from '../../services/donorService';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';

export default function DonationHistory() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        let donorRes;
        try {
          donorRes = await donorService.getMyProfile();
        } catch {
          donorRes = await donorService.getDonorById(user?._id || user?.id);
        }
        const donorData = donorRes?.data?.data?.donor || donorRes?.data?.data;
        if (donorData?._id) {
          const res = await donationService.getDonationsByDonor(donorData._id);
          if (res?.data?.data) {
            const raw = res.data.data;
            setDonations(Array.isArray(raw) ? raw : (raw.donations || []));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchDonations();
  }, [user]);

  if (loading) return <div className="h-64 bg-gray-200 animate-pulse rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Donation History</h1>
        <p className="text-sm text-gray-500">Record of all your completed blood contributions</p>
      </div>

      {donations.length === 0 ? (
        <EmptyState
          icon={Droplet}
          title="No Donations Recorded Yet"
          description="Your completed blood donations will appear here once verified by the blood bank administrator."
        />
      ) : (
        <div className="space-y-3">
          {donations.map((d) => (
            <Card key={d._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-red-200 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 font-extrabold text-xl flex items-center justify-center shrink-0">
                  {d.bloodGroup}
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <span>{d.unitsDonated} Unit(s) Donated</span>
                    <Badge variant="success">Completed</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {new Date(d.donationDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {d.location || 'Central Blood Bank'}
                    </span>
                  </div>
                </div>
              </div>
              {d.notes && <div className="text-xs text-gray-500 italic max-w-xs">{d.notes}</div>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
