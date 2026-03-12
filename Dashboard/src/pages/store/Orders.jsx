import React, { useState, useEffect } from 'react';
import { getOrders } from '../../api/store';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { formatCurrency, formatStatus, formatDate } from '../../utils/formatters';
import { ChevronDown, ChevronUp, Search, Filter } from 'lucide-react';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchOrders = async () => {
      setLoading(true);
      const data = await getOrders();
      if (mounted) {
        setOrders(data);
        setLoading(false);
      }
    };
    fetchOrders();
    return () => { mounted = false; };
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredOrders = orders.filter(o => {
    const matchesFilter = filter === 'All' ? true : o.status === filter.toLowerCase();
    const matchesSearch = o.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Orders</h1>
        
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search customer or Order ID..." 
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
              className="bg-transparent border-none outline-none text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer pl-1 w-full"
            >
              <option value="All" className='text-black font-semibold text-sm tracking-wider'>All Statuses</option>
              <option value="Completed" className='text-black font-semibold text-sm tracking-wider'>Completed</option>
              <option value="Pending" className='text-black font-semibold text-sm tracking-wider'>Pending</option>
              <option value="Cancelled" className='text-black font-semibold text-sm tracking-wider'>Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <Skeleton className="h-[400px] w-full rounded-xl" />
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-sm uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <React.Fragment key={order.id}>
                    <tr 
                      className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                      onClick={() => toggleExpand(order.id)}
                    >
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{order.id}</td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{order.customer}</td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{formatDate(order.date)}</td>
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{formatCurrency(order.total)}</td>
                      <td className="px-6 py-4">
                        <Badge color={order.status === 'completed' ? 'teal' : order.status === 'pending' ? 'yellow' : 'red'}>
                          {formatStatus(order.status)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {expandedId === order.id ? <ChevronUp className="w-5 h-5 mx-auto" /> : <ChevronDown className="w-5 h-5 mx-auto" />}
                      </td>
                    </tr>
                    {expandedId === order.id && (
                      <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                        <td colSpan={6} className="px-6 py-4">
                          <div className="pl-4 border-l-2 border-teal-500 py-2">
                             <h5 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-3">Order Items ({order.items})</h5>
                             <div className="space-y-2 max-w-lg">
                                {[...Array(order.items)].map((_, i) => (
                                  <div key={i} className="flex justify-between text-sm py-1 border-b border-dashed border-slate-200 dark:border-slate-700 last:border-0 text-slate-600 dark:text-slate-400">
                                    <span>Product {i+1} Example Name</span>
                                    <span>1 x {formatCurrency(order.total / order.items)}</span>
                                  </div>
                                ))}
                             </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
