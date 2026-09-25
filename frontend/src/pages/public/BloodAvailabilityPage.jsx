import React, { useEffect, useState } from 'react';
import { Search, Droplet, Filter, RefreshCw } from 'lucide-react';
import bloodService from '../../services/bloodService';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function BloodAvailabilityPage() {
  const [stock, setStock] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchStock = async () => {
    setLoading(true);
    try {
      const res = await bloodService.getAllStock();
      if (res.data?.data) {
        setStock(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const filteredStock = selectedGroup === 'ALL' 
    ? stock 
    : stock.filter(item => item.bloodGroup === selectedGroup);

  const bloodGroups = ['ALL', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Blood Stock Availability</h1>
          <p className="text-sm text-gray-500">Real-time inventory levels of all blood groups in the central bank</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchStock} className="self-start sm:self-auto flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh Stock
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-semibold text-gray-400 flex items-center gap-1 shrink-0 px-2">
          <Filter className="w-3.5 h-3.5" /> Group:
        </span>
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

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-40 bg-gray-100 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredStock.map((item) => {
            const statusVariant = 
              item.status === 'AVAILABLE' ? 'success' :
              item.status === 'LOW_STOCK' ? 'warning' : 'danger';

            return (
              <Card key={item._id || item.bloodGroup} className="hover:border-red-200 transition-all space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 font-black text-2xl flex items-center justify-center shadow-inner">
                    {item.bloodGroup}
                  </div>
                  <Badge variant={statusVariant}>
                    {item.status ? item.status.replace('_', ' ') : 'UNKNOWN'}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="text-3xl font-extrabold text-gray-900">
                    {item.unitsAvailable} <span className="text-sm font-medium text-gray-500">Units</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Last Updated: {item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString() : 'Today'}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
