import { useState, useEffect } from 'react';
import { getPatients } from '../../api/clinic';
import { PatientRecord } from '../../components/clinic/PatientRecord';
import { Skeleton } from '../../components/ui/Skeleton';
import { Input } from '../../components/ui/Input';
import { Search } from 'lucide-react';

export const PatientHistory = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchPatients = async () => {
      setLoading(true);
      const data = await getPatients();
      if (mounted) {
        setPatients(data);
        setLoading(false);
      }
    };
    fetchPatients();
    return () => { mounted = false; };
  }, []);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.owner.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Patient History</h1>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search patients or owners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 font-medium text-sm transition-colors text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPatients.map(patient => (
            <PatientRecord key={patient.id} patient={patient} />
          ))}
          {filteredPatients.length === 0 && (
            <p className="text-slate-500 text-center py-12">No patients matching your search criteria.</p>
          )}
        </div>
      )}
    </div>
  );
};
