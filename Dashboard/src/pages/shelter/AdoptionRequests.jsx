import { useState, useEffect } from 'react';
import { getAdoptionRequests } from '../../api/shelter';
import { AdoptionRequestCard } from '../../components/shelter/AdoptionRequestCard';
import { Skeleton } from '../../components/ui/Skeleton';
import { Filter, Search } from 'lucide-react';

export const AdoptionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchRequests = async () => {
      setLoading(true);
      const data = await getAdoptionRequests();
      if (mounted) {
        setRequests(data);
        setLoading(false);
      }
    };
    fetchRequests();
    return () => { mounted = false; };
  }, []);

  const filteredRequests = requests.filter(req => {
    const matchesFilter = filter === 'All' ? true : req.status === filter.toLowerCase();
    const matchesSearch = req.applicant.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          req.petName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Adoption Requests</h1>
        
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search applicant or pet..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500 w-full transition-shadow"
            />
          </div>
          <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-teal-500 transition-shadow w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer w-full"
            >
              <option value="All">All Requests</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map(request => (
            <AdoptionRequestCard key={request.id} request={request} />
          ))}
          {filteredRequests.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 border-dashed">
              No adoption requests found for this filter.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
