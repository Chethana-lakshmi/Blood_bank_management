import React from 'react';
import { Bell, CheckCheck, AlertCircle, Info, Heart } from 'lucide-react';
import useNotifications from '../../hooks/useNotifications';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';

export default function DonorNotifications() {
  const { notifications, markAsRead, markAllRead, loading } = useNotifications();

  if (loading) return <div className="h-64 bg-gray-200 animate-pulse rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500">Stay informed about emergency requests and donation updates</p>
        </div>
        {Array.isArray(notifications) && notifications.some(n => !n.isRead) && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="flex items-center gap-1.5">
            <CheckCheck className="w-4 h-4 text-emerald-600" /> Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No Notifications"
          description="You are all caught up! New alerts and updates will appear here."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <Card
              key={n._id}
              className={`flex items-start justify-between gap-4 cursor-pointer transition-all ${
                !n.isRead ? 'border-l-4 border-l-red-600 bg-red-50/20' : ''
              }`}
              onClick={() => !n.isRead && markAsRead(n._id)}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl mt-0.5 ${
                  n.type === 'EMERGENCY' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {n.type === 'EMERGENCY' ? <AlertCircle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-900 font-medium leading-relaxed">{n.message}</p>
                  <span className="text-xs text-gray-400 block">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              {!n.isRead && (
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0 mt-2" />
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
