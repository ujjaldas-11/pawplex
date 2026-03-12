import { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '../ui/Table';
import { formatCurrency } from '../../utils/formatters';
import { Trash2 } from 'lucide-react';

export const InventoryTable = ({ inventory }) => {
  const [editingId, setEditingId] = useState(null);
  const [editQty, setEditQty] = useState('');

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditQty(item.stock.toString());
  };

  const handleSave = () => {
    // API logic goes here
    setEditingId(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') setEditingId(null);
  };

  return (
    <Card className="overflow-hidden p-0">
      <Table>
        <Thead>
          <Tr>
            <Th>Product Name</Th>
            <Th>Category</Th>
            <Th>SKU</Th>
            <Th>Stock</Th>
            <Th>Price</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {inventory?.map((item) => {
            const status = item.stock >= 10 ? 'In Stock' : item.stock > 0 ? 'Low Stock' : 'Out of Stock';
            const statusColor = item.stock >= 10 ? 'teal' : item.stock > 0 ? 'yellow' : 'red';
            
            return (
              <Tr key={item.id}>
                <Td className="font-medium text-slate-900 dark:text-slate-100">{item.name}</Td>
                <Td>{item.category}</Td>
                <Td className="font-mono text-sm">{item.sku}</Td>
                <Td>
                  {editingId === item.id ? (
                    <input 
                      type="number"
                      value={editQty}
                      onChange={(e) => setEditQty(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onBlur={handleSave}
                      className="w-20 px-2 py-1 border border-teal-500 rounded outline-none text-slate-900 dark:text-slate-100 dark:bg-slate-800"
                      autoFocus
                    />
                  ) : (
                    <span 
                      className="cursor-pointer hover:text-teal-600 hover:underline inline-block min-w-[2rem]"
                      onClick={() => handleEditClick(item)}
                      title="Click to edit stock"
                    >
                      {item.stock}
                    </span>
                  )}
                </Td>
                <Td>{formatCurrency(item.price)}</Td>
                <Td>
                  <Badge color={statusColor}>
                    {status}
                  </Badge>
                </Td>
                <Td>
                   <button className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                     <Trash2 className="w-4 h-4" />
                   </button>
                </Td>
              </Tr>
            );
          })}
          {(!inventory || inventory.length === 0) && (
            <Tr>
              <Td colSpan={7} className="text-center py-8 text-slate-500">No inventory items found</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Card>
  );
};
