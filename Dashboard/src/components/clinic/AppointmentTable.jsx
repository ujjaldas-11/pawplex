import { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '../ui/Table';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { formatStatus } from '../../utils/formatters';
import { Modal } from '../ui/Modal';
import { Edit2, Trash2, Calendar as CalendarIcon, Clock, CheckCircle } from 'lucide-react';

export const AppointmentTable = ({ appointments }) => {
  return (
    <Card className="overflow-hidden p-0">
      <Table>
        <Thead>
          <Tr>
            <Th>Patient Name</Th>
            <Th>Pet Name</Th>
            <Th>Date & Time</Th>
            <Th>Type</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {appointments?.map((app) => (
            <Tr key={app.id}>
              <Td className="font-medium text-slate-900 dark:text-slate-100">{app.patient}</Td>
              <Td>{app.pet}</Td>
              <Td>
                <div className="flex items-center text-sm">
                  <CalendarIcon className="w-4 h-4 mr-1 text-slate-400" />
                  {new Date(app.date).toLocaleDateString()}
                  <Clock className="w-4 h-4 ml-3 mr-1 text-slate-400" />
                  {new Date(app.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </Td>
              <Td>{app.type}</Td>
              <Td>
                <Badge color={app.status === 'confirmed' ? 'teal' : app.status === 'pending' ? 'yellow' : app.status === 'cancelled' ? 'red' : 'slate'}>
                  {formatStatus(app.status)}
                </Badge>
              </Td>
              <Td>
                <div className="flex space-x-2">
                   <button className="p-1 text-slate-400 hover:text-teal-600 transition-colors">
                     <Edit2 className="w-4 h-4" />
                   </button>
                   <button className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                     <Trash2 className="w-4 h-4" />
                   </button>
                   {app.status === 'pending' && (
                     <button className="p-1 text-slate-400 hover:text-green-500 transition-colors" title="Confirm">
                       <CheckCircle className="w-4 h-4" />
                     </button>
                   )}
                </div>
              </Td>
            </Tr>
          ))}
          {(!appointments || appointments.length === 0) && (
            <Tr>
              <Td colSpan={6} className="text-center py-8 text-slate-500">No appointments found</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Card>
  );
};
