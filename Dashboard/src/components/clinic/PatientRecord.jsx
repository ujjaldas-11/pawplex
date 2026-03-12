import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const PatientRecord = ({ patient }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-xl">
             {patient.species === 'Dog' ? '🐶' : patient.species === 'Cat' ? '🐱' : '🐰'}
          </div>
          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{patient.name}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {patient.breed} • {patient.age} • Owner: {patient.owner}
            </p>
          </div>
        </div>
        <Button variant="ghost" onClick={() => setExpanded(!expanded)} className="border border-teal-200 dark:border-teal-800">
          {expanded ? 'Hide Details' : 'View Details'}
        </Button>
      </div>

      {expanded && (
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
          <h5 className="font-medium text-slate-900 dark:text-slate-100 mb-4">Visit History</h5>
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
             <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-5 h-5 rounded-full border-4 border-white dark:border-slate-800 bg-teal-500 text-slate-500 font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow"></div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm ml-4 md:ml-0 md:mr-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-teal-600 dark:text-teal-400 text-sm">Routine Checkup</span>
                    <time className="text-xs text-slate-500">{patient.lastVisit}</time>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Vaccinations updated. General health is excellent.</p>
                </div>
             </div>
          </div>
        </div>
      )}
    </Card>
  );
};
