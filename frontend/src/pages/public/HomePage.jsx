import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, Users, Building2, Droplet, Shield, Clock, CheckCircle2, ArrowRight, AlertTriangle } from 'lucide-react';
import bloodService from '../../services/bloodService';
import adminService from '../../services/adminService';
import Button from '../../components/ui/Button';

export default function HomePage() {
  const [stock, setStock] = useState([]);
  const [stats, setStats] = useState({ totalDonors: 120, totalHospitals: 45, totalDonations: 380, totalUnits: 450 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stockRes = await bloodService.getAllStock();
        if (stockRes.data?.data) {
          setStock(stockRes.data.data);
        }
        const statsRes = await adminService.getStatistics();
        if (statsRes.data?.data) {
          setStats(statsRes.data.data);
        }
      } catch (err) {
        console.log('Using default landing stats');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-red-50 via-white to-gray-50 pt-10 pb-16 px-4 rounded-3xl border border-red-100/50 shadow-sm text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold tracking-wide uppercase">
            <Heart className="w-3.5 h-3.5 fill-red-600 animate-pulse" />
            Every Drop Saves Lives
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Donate Blood. <span className="text-red-600 underline decoration-red-300">Save Lives.</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            BloodConnect bridges the gap between voluntary blood donors, hospitals, and blood banks in real-time. Join our network today to save patients in emergency need.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/blood-availability" className="w-full sm:w-auto">
              <Button size="lg" className="w-full flex items-center justify-center gap-2 shadow-lg shadow-red-500/20">
                <Search className="w-5 h-5" /> Find Blood Now
              </Button>
            </Link>
            <Link to="/register" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full flex items-center justify-center gap-2">
                <Heart className="w-5 h-5 text-red-600" /> Become a Donor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Live Blood Availability Preview */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Live Blood Availability</h2>
          <p className="text-sm text-gray-500">Real-time blood stock status across participating facilities</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {bloodGroups.map((group) => {
            const groupData = stock.find((item) => item.bloodGroup === group);
            const units = groupData ? groupData.unitsAvailable : 0;
            const status = groupData ? groupData.status : 'AVAILABLE';
            return (
              <div key={group} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-between space-y-2 hover:border-red-200 transition-all">
                <span className="text-2xl font-black text-red-600 bg-red-50 w-12 h-12 rounded-full flex items-center justify-center">
                  {group}
                </span>
                <div className="text-center">
                  <span className="text-xl font-bold text-gray-900">{units}</span>
                  <span className="text-xs text-gray-500 block">Units Available</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700' :
                  status === 'LOW_STOCK' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                }`}>
                  {status.replace('_', ' ')}
                </span>
              </div>
            );
          })}
        </div>
        <div className="text-center">
          <Link to="/blood-availability" className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700">
            View Complete Stock & Hospitals <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Donor & Hospital Impact Stats */}
      <section className="bg-red-600 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <Users className="w-8 h-8 mx-auto text-red-200" />
            <div className="text-3xl sm:text-4xl font-extrabold">{stats.totalDonors || 120}+</div>
            <div className="text-xs sm:text-sm text-red-100">Registered Donors</div>
          </div>
          <div className="space-y-1">
            <Building2 className="w-8 h-8 mx-auto text-red-200" />
            <div className="text-3xl sm:text-4xl font-extrabold">{stats.totalHospitals || 45}+</div>
            <div className="text-xs sm:text-sm text-red-100">Verified Hospitals</div>
          </div>
          <div className="space-y-1">
            <Droplet className="w-8 h-8 mx-auto text-red-200" />
            <div className="text-3xl sm:text-4xl font-extrabold">{stats.totalDonations || 380}+</div>
            <div className="text-xs sm:text-sm text-red-100">Successful Donations</div>
          </div>
          <div className="space-y-1">
            <Shield className="w-8 h-8 mx-auto text-red-200" />
            <div className="text-3xl sm:text-4xl font-extrabold">100%</div>
            <div className="text-xs sm:text-sm text-red-100">Safe & Verified</div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-8 max-w-5xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How BloodConnect Works</h2>
          <p className="text-sm text-gray-500">Streamlined process for donors, hospitals, and administrators</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 font-bold flex items-center justify-center">1</div>
            <h3 className="text-lg font-bold text-gray-900">Register Profile</h3>
            <p className="text-sm text-gray-600">Sign up as a Donor or Hospital. Keep your availability and location updated.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 font-bold flex items-center justify-center">2</div>
            <h3 className="text-lg font-bold text-gray-900">Request or Donate</h3>
            <p className="text-sm text-gray-600">Hospitals submit emergency or normal blood requests. Donors schedule donations.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 font-bold flex items-center justify-center">3</div>
            <h3 className="text-lg font-bold text-gray-900">Track & Complete</h3>
            <p className="text-sm text-gray-600">Real-time status updates from request creation to stock deduction and completion.</p>
          </div>
        </div>
      </section>

      {/* Emergency Callout Banner */}
      <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900">Are you a Hospital facing an Emergency?</h3>
            <p className="text-sm text-gray-600">Create an instant high-priority emergency blood request for immediate processing.</p>
          </div>
        </div>
        <Link to="/register" className="shrink-0 w-full sm:w-auto">
          <Button variant="danger" className="w-full">Create Emergency Request</Button>
        </Link>
      </section>
    </div>
  );
}
