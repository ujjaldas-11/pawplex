import { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '../ui/Table';
import { Button } from '../ui/Button';
import { formatStatus } from '../../utils/formatters';
import { Edit2, Trash2 } from 'lucide-react';

export const ListingTable = ({ listings }) => {
  return (
    <Card className="overflow-hidden p-0">
      <Table>
        <Thead>
          <Tr>
            <Th>Photo</Th>
            <Th>Name</Th>
            <Th>Species</Th>
            <Th>Breed & Age</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {listings?.map((animal) => (
            <Tr key={animal.id}>
              <Td>
                <img 
                  src={animal.photo} 
                  alt={animal.name} 
                  className="w-12 h-12 rounded-lg object-cover bg-slate-100"
                />
              </Td>
              <Td className="font-medium text-slate-900 dark:text-slate-100">{animal.name}</Td>
              <Td>{animal.species}</Td>
              <Td>
                <div className="text-sm">
                  <div className="text-slate-900 dark:text-slate-100">{animal.breed}</div>
                  <div className="text-slate-500">{animal.age}</div>
                </div>
              </Td>
              <Td>
                <Badge color={animal.status === 'available' ? 'teal' : animal.status === 'pending' ? 'yellow' : 'slate'}>
                  {formatStatus(animal.status)}
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
                </div>
              </Td>
            </Tr>
          ))}
          {(!listings || listings.length === 0) && (
            <Tr>
              <Td colSpan={6} className="text-center py-8 text-slate-500">No listings found</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Card>
  );
};
