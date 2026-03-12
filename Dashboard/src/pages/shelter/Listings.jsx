import { useState, useEffect } from 'react';
import { getListings } from '../../api/shelter';
import { ListingTable } from '../../components/shelter/ListingTable';
import { Skeleton } from '../../components/ui/Skeleton';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, Search } from 'lucide-react';

export const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchListings = async () => {
      setLoading(true);
      const data = await getListings();
      if (mounted) {
        setListings(data);
        setLoading(false);
      }
    };
    fetchListings();
    return () => { mounted = false; };
  }, []);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
  };

  const filteredListings = listings.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.breed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Animal Listings</h1>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search animals..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500 w-full md:w-64 transition-shadow"
            />
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden md:inline">Add Animal</span>
            <span className="inline md:hidden">Add</span>
          </Button>
        </div>
      </div>

      {loading ? (
        <Skeleton className="h-[400px] w-full rounded-xl" />
      ) : (
        <ListingTable listings={filteredListings} />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Animal">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input label="Name" required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Species" required />
            <Input label="Breed" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Age" required />
            <div>
              <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1 font-medium">
                Status
              </label>
              <select className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 outline-none transition-colors bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500">
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="adopted">Adopted</option>
              </select>
            </div>
          </div>
          <Input label="Photo URL" />
          
          <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700 mt-6">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Animal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
