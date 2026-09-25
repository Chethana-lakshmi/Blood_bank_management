import React, { useEffect, useState } from 'react';
import { Search, UserCheck, Shield, Trash2 } from 'lucide-react';
import adminService from '../../services/adminService';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await adminService.getAllUsers();
        if (res.data?.data) {
          setUsers(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="h-64 bg-gray-200 animate-pulse rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500">All registered system user accounts across roles</p>
        </div>
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search name, email, role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
          />
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50/50 transition-all">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{u.name}</div>
                    <div className="text-xs text-gray-500">{u.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={
                      u.role === 'admin' ? 'danger' :
                      u.role === 'hospital' ? 'info' : 'success'
                    }>
                      {u.role.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
