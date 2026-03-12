import { useState, useEffect } from 'react';
import { getAnalytics } from '../api/analytics';

export const useAnalytics = () => {
  const [data, setData] = useState({
    stats: null,
    appointmentTrend: [],
    adoptionTrend: [],
    healthTrend: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const result = await getAnalytics();
        if (mounted) {
          setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchAnalytics();

    return () => {
      mounted = false;
    };
  }, []);

  return { ...data, loading };
};
