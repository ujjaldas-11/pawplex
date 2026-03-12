import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatStatus } from '../../utils/formatters';

export const AdoptionRequestCard = ({ request }) => {
  return (
    <Card className="flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {request.applicant}
          </h4>
          <p className="text-sm text-slate-500">Interested in: <span className="font-medium text-teal-600 dark:text-teal-400">{request.petName}</span></p>
        </div>
        <Badge color={request.status === 'approved' ? 'teal' : request.status === 'pending' ? 'yellow' : 'red'}>
          {formatStatus(request.status)}
        </Badge>
      </div>

      <div className="space-y-2 mb-4 flex-1">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          <span className="font-medium text-slate-700 dark:text-slate-300">Email:</span> {request.email}
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          <span className="font-medium text-slate-700 dark:text-slate-300">Phone:</span> {request.phone}
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          <span className="font-medium text-slate-700 dark:text-slate-300">Date:</span> {request.date}
        </div>
        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-sm text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
          <p className="font-medium mb-1">Message:</p>
          <p>"{request.message}"</p>
        </div>
      </div>

      {request.status === 'pending' && (
        <div className="flex space-x-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <Button className="flex-1 bg-teal-600 hover:bg-teal-700 transition-colors">
            Approve
          </Button>
          <Button className="flex-1 bg-red-500 hover:bg-red-600 transition-colors text-white">
            Reject
          </Button>
        </div>
      )}
    </Card>
  );
};
