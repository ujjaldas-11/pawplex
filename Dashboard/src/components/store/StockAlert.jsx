import { AlertTriangle } from 'lucide-react';

export const StockAlert = ({ count }) => {
  if (!count || count <= 0) return null;

  return (
    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-start">
      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
      <div>
        <h4 className="text-red-800 dark:text-red-300 font-medium">Low Stock Alert</h4>
        <p className="text-red-700 dark:text-red-400 text-sm mt-1">
          You have {count} items running severely low on stock (less than 10 units left). Please review the inventory table and replenish stock soon.
        </p>
      </div>
    </div>
  );
};
