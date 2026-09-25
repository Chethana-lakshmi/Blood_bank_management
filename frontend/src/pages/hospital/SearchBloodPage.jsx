import React, { useEffect, useState } from 'react';
import { Search, Droplet, Filter, RefreshCw, Phone } from 'lucide-react';
import bloodService from '../../services/bloodService';
import donorService from '../../services/donorService';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function SearchBloodPage() {
  const [stock, setStock] = useState([]);
  const [donors, setDonors] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const stockRes = await bloodService.getAllStock();
        if (stockRes.data?.data) setStock(stockRes.data.data);
        const donorRes = await donorService.getAllDonors();
        if (donorRes.data?.data) setDonors(donorRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const bloodGroups = ['ALL', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const filteredStock = selectedGroup === 'ALL' ? stock : stock.filter(s => s.bloodGroup === selectedGroup);
  const filteredDonors = selectedGroup === 'ALL' 
    ? donors.filter(d => d.availabilityStatus === 'AVAILABLE')
    : donors.filter(d => d.bloodGroup === selectedGroup && d.availabilityStatus === 'AVAILABLE');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Search Blood Availability & Donors</h1>
        <p className="text-sm text-gray-500">Find real-time blood bank units and available voluntary donors</p>
      </div>

      {/* Group selector tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-semibold text-gray-400 shrink-0">Blood Group:</span>
        {bloodGroups.map((group) => (
          <button
            key={group}
            onClick={() => setSelectedGroup(group)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              selectedGroup === group
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {group}
          </button>
        ))}
      </div>

      {/* Stock summary */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900">Central Blood Bank Stock</h2>
        {loading ? (
          <div className="h-32 bg-gray-200 animate-pulse rounded-2xl" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {filteredStock.map((item) => (
              <Card key={item.bloodGroup} className="space-y-2 text-center">
                <span className="text-2xl font-black text-red-600 bg-red-50 w-10 h-10 rounded-full inline-flex items-center justify-center">
                  {item.bloodGroup}
                </span>
                <div>
                  <div className="text-xl font-bold text-gray-900">{item.unitsAvailable} Units</div>
                  <Badge variant={item.status === 'AVAILABLE' ? 'success' : item.status === 'LOW_STOCK' ? 'warning' : 'danger'}>
                    {item.status ? item.status.replace('_', ' ') : 'UNKNOWN'}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Available Donors */}
      <div className="space-y-3 pt-4">
        <h2 className="text-lg font-bold text-gray-900">Available Voluntary Donors ({filteredDonors.length})</h2>
        {filteredDonors.length === 0 ? (
          <Card className="text-center py-6 text-gray-500 text-sm">
            No active donors found for selected filter.
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDonors.map((d) => (
              <Card key={d._id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 font-extrabold flex items-center justify-center text-sm">
                      {d.bloodGroup}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{d.user?.name || 'Registered Donor'}</div>
                      <div className="text-xs text-gray-500">{d.city}, {d.state}</div>
                    </div>
                  </div>
                  <Badge variant="success">AVAILABLE</Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-100">
                  <span className="flex items-center gap-1 font-semibold text-gray-800">
                    <Phone className="w-3.5 h-3.5 text-red-500" /> {d.phone || 'Contact via request'}
                  </span>
                  <span>{d.donationCount || 0} Donations</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
