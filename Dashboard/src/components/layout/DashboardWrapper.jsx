import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { NotificationSidebar } from './NotificationSidebar';

export const DashboardWrapper = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationSidebarOpen, setIsNotificationSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleNotificationSidebar = () => setIsNotificationSidebarOpen(!isNotificationSidebarOpen);

  const getPageTitle = (path) => {
    if (path === '/overview') return 'Overview';
    if (path.includes('/appointments')) return 'Appointments';
    if (path.includes('/patients')) return 'Patient History';
    if (path.includes('/settings')) return 'Settings';
    if (path.includes('/listings')) return 'Listings';
    if (path.includes('/requests')) return 'Adoption Requests';
    if (path.includes('/inventory')) return 'Inventory';
    if (path.includes('/orders')) return 'Orders';
    return 'Dashboard';
  };

  const title = getPageTitle(location.pathname);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden font-sans">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar toggleSidebar={toggleSidebar} toggleNotificationSidebar={toggleNotificationSidebar} title={title} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 pb-20 md:pb-12">
            <Outlet />
          </div>
        </main>
      </div>

      <NotificationSidebar 
        isOpen={isNotificationSidebarOpen} 
        onClose={() => setIsNotificationSidebarOpen(false)} 
      />
    </div>
  );
};
