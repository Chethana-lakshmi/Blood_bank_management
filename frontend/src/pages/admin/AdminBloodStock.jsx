import React, { useEffect, useState } from 'react';
import { Droplet, Plus, Minus, RefreshCw } from 'lucide-react';
import bloodService from '../../services/bloodService';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function AdminBloodStock() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [unitsDelta, setUnitsDelta] = useState(0);
  const [updating, setUpdating] = useState(false);

  const fetchStock = async () => {
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

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    if (!selectedItem || unitsDelta === 0) return;
    setUpdating(true);
    try {
      await bloodService.updateStock(selectedItem._id, unitsDelta);
      setSelectedItem(null);
      setUnitsDelta(0);
      fetchStock();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update stock');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="h-64 bg-gray-200 animate-pulse rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Blood Stock Inventory</h1>
          <p className="text-sm text-gray-500">Manage real-time blood group stock levels</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchStock} className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stock.map((item) => (
          <Card key={item._id} className="space-y-4 hover:border-red-200 transition-all">
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 font-black text-2xl flex items-center justify-center shadow-inner">
                {item.bloodGroup}
              </div>
              <Badge variant={item.status === 'AVAILABLE' ? 'success' : item.status === 'LOW_STOCK' ? 'warning' : 'danger'}>
                {item.status ? item.status.replace('_', ' ') : 'UNKNOWN'}
              </Badge>
            </div>

            <div>
              <div className="text-3xl font-extrabold text-gray-900">{item.unitsAvailable} <span className="text-sm font-medium text-gray-500">Units</span></div>
              <div className="text-xs text-gray-400 mt-0.5">Updated: {new Date(item.lastUpdated).toLocaleDateString()}</div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setSelectedItem(item); setUnitsDelta(5); }}
                className="flex-1 flex items-center justify-center gap-1 text-xs"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-600" /> Add Units
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setSelectedItem(item); setUnitsDelta(-5); }}
                className="flex-1 flex items-center justify-center gap-1 text-xs"
              >
                <Minus className="w-3.5 h-3.5 text-red-600" /> Remove
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Adjust Stock Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">
              Update Stock: <span className="text-red-600">{selectedItem.bloodGroup}</span>
            </h3>
            <p className="text-xs text-gray-500">
              Current Units: <strong className="text-gray-900">{selectedItem.unitsAvailable}</strong>
            </p>

            <form onSubmit={handleUpdateStock} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Units Adjustment (+ or -)</label>
                <input
                  type="number"
                  value={unitsDelta}
                  onChange={(e) => setUnitsDelta(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 font-bold"
                />
                <span className="text-[10px] text-gray-400 block mt-1">Use positive value to add, negative to remove</span>
              </div>

              <div className="flex gap-2">
                <Button type="submit" loading={updating} className="flex-1">Confirm Update</Button>
                <Button type="button" variant="outline" onClick={() => setSelectedItem(null)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
