import { useState, useEffect } from 'react';
import { getAppointments } from '../../api/clinic';
import { AppointmentTable } from '../../components/clinic/AppointmentTable';
import { Skeleton } from '../../components/ui/Skeleton';

export const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Today');

  useEffect(() => {
    let mounted = true;
    const fetchApps = async () => {
      setLoading(true);
      const data = await getAppointments();
      if (mounted) {
        setAppointments(data);
        setLoading(false);
      }
    };
    fetchApps();
    return () => { mounted = false; };
  }, []);

  const TABS = ['Today', 'This Week', 'All'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Appointments</h1>
        <div className="flex space-x-6">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-1 text-sm font-medium transition-colors relative ${
                activeTab === tab 
                  ? 'text-teal-600 dark:text-teal-400' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-[-9px] left-0 w-full h-[2px] bg-teal-600 dark:bg-teal-400 rounded-t" />
              )}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Skeleton className="h-[400px] w-full rounded-xl" />
      ) : (
        <AppointmentTable appointments={appointments} />
      )}
    </div>
  );
};
