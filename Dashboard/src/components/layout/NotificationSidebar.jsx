import { useState } from 'react';
import { X, Calendar, Package, Users, Activity, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useNotificationStore } from '../../store/notificationStore';

export const NotificationSidebar = ({ isOpen, onClose }) => {
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIconForType = (type) => {
    switch (type) {
      case 'appointment': return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'inventory': return <Package className="w-5 h-5 text-orange-500" />;
      case 'adoption': return <Users className="w-5 h-5 text-purple-500" />;
      case 'system': return <Activity className="w-5 h-5 text-teal-500" />;
      default: return null;
    }
  };

  const getBgColorForType = (type) => {
    switch (type) {
      case 'appointment': return 'bg-blue-100 dark:bg-blue-900/40';
      case 'inventory': return 'bg-orange-100 dark:bg-orange-900/40';
      case 'adoption': return 'bg-purple-100 dark:bg-purple-900/40';
      case 'system': return 'bg-teal-100 dark:bg-teal-900/40';
      default: return 'bg-slate-100 dark:bg-slate-900/40';
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/20 dark:bg-slate-900/60 z-30 transition-opacity duration-300 backdrop-blur-sm ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 shadow-2xl z-40 transform transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Notifications</h2>
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-400 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`relative p-4 rounded-xl border transition-all ${
                !notification.read 
                  ? 'border-teal-200 dark:border-teal-800/50 bg-teal-50/50 dark:bg-teal-900/10' 
                  : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 opacity-75'
              }`}
            >
              {!notification.read && (
                <div className="absolute top-4 right-4 w-2 h-2 bg-teal-500 rounded-full" />
              )}
              
              <div className="flex items-start">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getBgColorForType(notification.type)}`}>
                  {getIconForType(notification.type)}
                </div>
                
                <div className="ml-3 flex-1 pr-4">
                  <h3 className={`text-sm font-semibold ${!notification.read ? 'text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'}`}>
                    {notification.title}
                  </h3>
                  <p className={`text-xs mt-1 leading-snug ${!notification.read ? 'text-slate-600 dark:text-slate-400' : 'text-slate-500'}`}>
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-slate-400 uppercase font-medium tracking-wider">
                      {notification.timestamp}
                    </span>
                    {!notification.read && (
                      <button 
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center py-10">
              <p className="text-slate-500 dark:text-slate-400 text-sm">You have no notifications.</p>
            </div>
          )}
        </div>

        {unreadCount > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <Button onClick={markAllAsRead} variant="ghost" className="w-full text-teal-600 dark:text-teal-400">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
