import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Bell, Calendar, Package, Users, Activity, CheckCircle2 } from 'lucide-react';
import { useNotificationStore } from '../store/notificationStore';

export const Notifications = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIconForType = (type) => {
    switch (type) {
      case 'appointment': return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'inventory': return <Package className="w-5 h-5 text-orange-500" />;
      case 'adoption': return <Users className="w-5 h-5 text-purple-500" />;
      case 'system': return <Activity className="w-5 h-5 text-teal-500" />;
      default: return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  const getBgColorForType = (type) => {
    switch (type) {
      case 'appointment': return 'bg-blue-100 dark:bg-blue-900/30';
      case 'inventory': return 'bg-orange-100 dark:bg-orange-900/30';
      case 'adoption': return 'bg-purple-100 dark:bg-purple-900/30';
      case 'system': return 'bg-teal-100 dark:bg-teal-900/30';
      default: return 'bg-slate-100 dark:bg-slate-900/30';
    }
  };

  const formatTimeAgo = (dateStr) => {
    try {
      const msPerMinute = 60 * 1000;
      const msPerHour = msPerMinute * 60;
      const msPerDay = msPerHour * 24;
      const elapsed = Date.now() - new Date(dateStr).getTime();
      
      if (elapsed < msPerMinute) return Math.round(elapsed/1000) + ' seconds ago';
      if (elapsed < msPerHour) return Math.round(elapsed/msPerMinute) + ' mins ago';
      if (elapsed < msPerDay) return Math.round(elapsed/msPerHour) + ' hours ago';
      return Math.round(elapsed/msPerDay) + ' days ago';
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
            Notifications 
            {unreadCount > 0 && (
              <span className="ml-3 px-2.5 py-0.5 text-xs font-semibold bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-400 rounded-full">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your alerts and system messages.</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" onClick={markAllAsRead} className="text-teal-600 dark:text-teal-400">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`p-4 transition-all duration-200 ${
              !notification.read 
                ? 'border-l-4 border-l-teal-500 bg-teal-50/30 dark:bg-teal-900/10' 
                : 'opacity-80'
            }`}
          >
            <div className="flex items-start">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 ${getBgColorForType(notification.type)}`}>
                {getIconForType(notification.type)}
              </div>
              
              <div className="ml-4 flex-1">
                <div className="flex items-start justify-between">
                  <h3 className={`font-semibold ${!notification.read ? 'text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'}`}>
                    {notification.title}
                  </h3>
                  <span className="text-xs text-slate-500 whitespace-nowrap ml-4">
                    {formatTimeAgo(notification.timestamp)}
                  </span>
                </div>
                
                <p className={`text-sm mt-1 ${!notification.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                  {notification.message}
                </p>
                
                {!notification.read && (
                  <button 
                    onClick={() => markAsRead(notification.id)}
                    className="mt-3 text-xs font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
        {notifications.length === 0 && (
          <div className="text-center py-12 text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 border-dashed">
            <Bell className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p>You're all caught up! No notifications yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
