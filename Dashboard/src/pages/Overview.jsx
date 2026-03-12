import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useAnalytics } from '../hooks/useAnalytics';
import { Skeleton } from '../components/ui/Skeleton';
import { StatsCard } from '../components/ui/StatsCard';
import { Card } from '../components/ui/Card';
import { AppointmentChart } from '../components/charts/AppointmentChart';
import { AdoptionChart } from '../components/charts/AdoptionChart';
import { HealthTrendChart } from '../components/charts/HealthTrendChart';
import { Users, Calendar, DollarSign, Activity, Heart, Eye } from 'lucide-react';

export const Overview = () => {
  const { user } = useAuthStore();
  const { stats, appointmentTrend, adoptionTrend, healthTrend, loading } = useAnalytics();

  const getIconForLabel = (label) => {
    if (label.includes('Patient') || label.includes('Customer')) return Users;
    if (label.includes('Appointment') || label.includes('Order')) return Calendar;
    if (label.includes('Revenue') || label.includes('Sales')) return DollarSign;
    if (label.includes('Adoption') || label.includes('Care')) return Heart;
    return Activity;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Overview</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Welcome back, {user?.name || 'User'}. Here's what's happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading 
          ? Array(4).fill(0).map((_, i) => <Skeleton key={i} variant="card" />)
          : stats?.map((stat, i) => (
              <StatsCard 
                key={i} 
                title={stat.label} 
                value={stat.value} 
                change={stat.change} 
                icon={getIconForLabel(stat.label)} 
              />
            ))
        }
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {user?.role === 'vet' ? 'Weekly Appointments' : user?.role === 'store' ? 'Weekly Orders' : 'Weekly Activity'}
            </h3>
          </div>
          {loading ? <Skeleton className="h-72 w-full rounded-xl" /> : <AppointmentChart data={appointmentTrend} />}
        </Card>

        <Card className="dark:[&_.recharts-tooltip-cursor]:fill-slate-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {user?.role === 'shelter' ? 'Monthly Adoptions' : 'Monthly Performance'}
            </h3>
          </div>
          {loading ? <Skeleton className="h-72 w-full rounded-xl" /> : <AdoptionChart data={adoptionTrend} />}
        </Card>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {user?.role === 'vet' ? 'Long-term Health Trends' : 'Platform Growth Trend'}
          </h3>
        </div>
        {loading ? <Skeleton className="h-72 w-full rounded-xl" /> : <HealthTrendChart data={healthTrend} />}
      </Card>
    </div>
  );
};
