import { Card } from '../ui/Card';

export const ScheduleCalendar = () => {
  return (
    <Card className="p-0 overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <h4 className="font-semibold text-slate-900 dark:text-slate-100">Quick Schedule</h4>
      </div>
      <div className="p-4 flex-1 flex items-center justify-center text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="text-center">
          <div className="text-4xl mb-2 flex justify-center opacity-50">📅</div>
          <p className="text-sm">Calendar mini-view coming soon.</p>
        </div>
      </div>
    </Card>
  );
};
