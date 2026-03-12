import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
  LayoutDashboard, Calendar, Users, List, 
  Package, ShoppingCart, Settings, LogOut, 
  ChevronLeft, ChevronRight, PawPrint
} from 'lucide-react';

const VET_LINKS = [
  { to: '/overview', icon: LayoutDashboard, label: 'Overview' },
  { to: '/profile', icon: Users, label: 'My Profile' },
  { to: '/vet/appointments', icon: Calendar, label: 'Appointments' },
  { to: '/vet/patients', icon: Users, label: 'Patients' },
  { to: '/vet/settings', icon: Settings, label: 'Settings' },
];

const SHELTER_LINKS = [
  { to: '/overview', icon: LayoutDashboard, label: 'Overview' },
  { to: '/profile', icon: Users, label: 'My Profile' },
  { to: '/shelter/listings', icon: List, label: 'Listings' },
  { to: '/shelter/requests', icon: Users, label: 'Adoption Requests' },
  { to: '/shelter/settings', icon: Settings, label: 'Settings' },
];

const STORE_LINKS = [
  { to: '/overview', icon: LayoutDashboard, label: 'Overview' },
  { to: '/profile', icon: Users, label: 'My Profile' },
  { to: '/store/inventory', icon: Package, label: 'Inventory' },
  { to: '/store/orders', icon: ShoppingCart, label: 'Orders' },
];

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuthStore();
  
  const links = user?.role === 'vet' 
    ? VET_LINKS 
    : user?.role === 'shelter' 
    ? SHELTER_LINKS 
    : user?.role === 'store' 
    ? STORE_LINKS 
    : [];

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`md:hidden fixed inset-0 z-20 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />

      <aside 
        className={`bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 flex flex-col h-full fixed md:relative z-30 ${
          isOpen 
            ? 'w-[240px] translate-x-0' 
            : 'w-[240px] md:w-[64px] -translate-x-full md:translate-x-0'
        }`}
      >
        <Link to="/" className="h-16 flex items-center justify-center border-b border-slate-200 dark:border-slate-700 px-4 hover:opacity-90 transition-opacity">
          <PawPrint className="w-8 h-8 text-teal-600 flex-shrink-0" />
          <span className={`ml-3 font-bold text-xl text-teal-600 dark:text-teal-400 whitespace-nowrap overflow-hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 md:hidden'}`}>
            PawCare+
          </span>
        </Link>

      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full p-1 text-slate-500 hover:text-teal-600 shadow-sm z-10"
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      <div className="p-3 flex-1 overflow-y-auto">
        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => 
                `flex items-center px-2.5 py-2 md:px-3 md:py-2.5 text-sm md:text-base rounded-lg transition-colors duration-150 ${
                  isActive 
                    ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 font-medium' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-teal-50 dark:hover:bg-slate-800'
                }`
              }
              title={!isOpen ? link.label : undefined}
            >
              <link.icon className={`w-4 h-4 md:w-5 md:h-5 flex-shrink-0 ${!isOpen ? 'mx-auto' : 'mr-3'}`} />
              {isOpen && <span className="whitespace-nowrap">{link.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 p-3">
        <div className={`flex items-center ${!isOpen ? 'justify-center' : 'justify-between'}`}>
          <Link to="/profile" className="flex items-center overflow-hidden hover:opacity-80 transition-opacity" title="My Profile">
            <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-300 font-semibold flex-shrink-0">
              {getUserInitials(user?.name)}
            </div>
            {isOpen && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize truncate">
                  {user?.role || 'Guest'}
                </p>
              </div>
            )}
          </Link>
          {isOpen && (
            <button 
              onClick={logout}
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-700 rounded-lg transition-colors ml-2"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </aside>
    </>
  );
};
