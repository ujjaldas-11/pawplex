import { useState, useEffect } from 'react';
import { getInventory } from '../../api/store';
import { InventoryTable } from '../../components/store/InventoryTable';
import { StockAlert } from '../../components/store/StockAlert';
import { Skeleton } from '../../components/ui/Skeleton';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, Search } from 'lucide-react';

export const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchInv = async () => {
      setLoading(true);
      const data = await getInventory();
      if (mounted) {
        setInventory(data);
        setLoading(false);
      }
    };
    fetchInv();
    return () => { mounted = false; };
  }, []);

  const lowStockCount = inventory.filter(i => i.stock < 10).length;

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
  };

  const filteredInventory = inventory.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Inventory Management</h1>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500 w-full md:w-64 transition-shadow"
            />
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden md:inline">Add Product</span>
            <span className="inline md:hidden">Add</span>
          </Button>
        </div>
      </div>

      {!loading && lowStockCount > 0 && <StockAlert count={lowStockCount} />}

      {loading ? (
        <Skeleton className="h-[400px] w-full rounded-xl" />
      ) : (
        <InventoryTable inventory={filteredInventory} />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Product">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input label="Product Name" required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Category" required />
            <Input label="SKU" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Initial Stock" type="number" required />
            <Input label="Price (₹)" type="number" step="0.01" required />
          </div>
          
          <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700 mt-6">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Product
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
