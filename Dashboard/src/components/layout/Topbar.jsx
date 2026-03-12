import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Moon, Sun, Bell } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';

export const Topbar = ({ toggleSidebar, toggleNotificationSidebar, title = 'Dashboard' }) => {
  const { user } = useAuthStore();
  const unreadCount = useNotificationStore(state => state.notifications.filter(n => !n.read).length);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="mr-4 p-2 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h1>
      </div>

      <div className="flex items-center space-x-3">
        <button 
          onClick={toggleNotificationSidebar}
          className="p-2 rounded-lg text-slate-500 hover:bg-teal-50 dark:hover:bg-slate-700 transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-800"></span>
          )}
        </button>

        <button 
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:bg-teal-50 dark:hover:bg-slate-700 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          ) : (
            <Moon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          )}
        </button>

        <Link to="/profile" className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-300 font-semibold border border-slate-200 dark:border-slate-600 ml-2 shadow-sm hover:opacity-80 transition-opacity md:hidden">
           {user?.name?.[0]?.toUpperCase() || 'U'}
        </Link>
      </div>
    </header>
  );
};
