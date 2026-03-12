import { Card } from './Card';

export const StatsCard = ({ title, value, icon: Icon, change }) => {
  const isPositive = change > 0;
  
  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          {title}
        </span>
        <div className="bg-teal-100 dark:bg-teal-900/30 p-3 rounded-full text-teal-600 dark:text-teal-400">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {value}
        </h4>
        {change !== undefined && (
          <p className={`text-xs mt-1 font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {isPositive ? '+' : ''}{change}% from last month
          </p>
        )}
      </div>
    </Card>
  );
};
