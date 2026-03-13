import api from './axios';
import { useAuthStore } from '../store/authStore';

export const getAnalytics = async () => {
  try {
    const response = await api.get('/dashboard/stats/');
    return response.data;
  } catch (error) {
    console.warn("Using mock analytics data");
    const role = useAuthStore.getState().user?.role || 'vet';
    
    // Role-specific stats
    let stats = [];
    if (role === 'vet') {
      stats = [
        { label: 'Total Patients', value: '1,248', change: 12 },
        { label: 'Appointments Today', value: '24', change: -5 },
        { label: 'Revenue (MTD)', value: '₹4,52,000', change: 8 },
        { label: 'Active Treatments', value: '156', change: 2 }
      ];
    } else if (role === 'shelter') {
      stats = [
        { label: 'Animals in Care', value: '142', change: -2 },
        { label: 'Adoptions (MTD)', value: '38', change: 15 },
        { label: 'Pending Requests', value: '14', change: 5 },
        { label: 'New Arrivals', value: '8', change: 0 }
      ];
    } else {
      stats = [
        { label: 'Total Sales', value: '₹1,24,500', change: 10 },
        { label: 'Orders Today', value: '45', change: 5 },
        { label: 'Low Stock Items', value: '12', change: -2 },
        { label: 'Customers', value: '856', change: 4 }
      ];
    }

    // Generic trends for charts
    return {
      stats,
      appointmentTrend: [
        { day: 'Mon', count: 12 }, { day: 'Tue', count: 19 },
        { day: 'Wed', count: 15 }, { day: 'Thu', count: 22 },
        { day: 'Fri', count: 28 }, { day: 'Sat', count: 32 },
        { day: 'Sun', count: 18 }
      ],
      adoptionTrend: [
        { month: 'Oct', adoptions: 15 }, { month: 'Nov', adoptions: 22 },
        { month: 'Dec', adoptions: 45 }, { month: 'Jan', adoptions: 30 },
        { month: 'Feb', adoptions: 28 }, { month: 'Mar', adoptions: 35 }
      ],
      healthTrend: [
        { month: 'Oct', records: 120 }, { month: 'Nov', records: 145 },
        { month: 'Dec', records: 130 }, { month: 'Jan', records: 160 },
        { month: 'Feb', records: 155 }, { month: 'Mar', records: 180 }
      ]
    };
  }
};
