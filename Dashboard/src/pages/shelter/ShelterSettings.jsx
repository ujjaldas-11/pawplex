import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const ShelterSettings = () => {
  const [formData, setFormData] = useState({
    name: 'Happy Paws Rescue',
    email: 'adopt@happypaws.org',
    phone: '+91 99887 76655',
    address: '456 Safe Haven Way',
    capacity: '50 Dogs, 80 Cats',
    description: 'A no-kill animal shelter dedicated to finding forever homes for abandoned pets.',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert("Shelter settings saved successfully!");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-8">Shelter Settings</h1>

      <form onSubmit={handleSave}>
        <Card className="mb-6 space-y-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-700">
            Shelter Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Shelter Name" name="name" value={formData.name} onChange={handleChange} />
            <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} />
            <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
            <Input label="Maximum Capacity" name="capacity" value={formData.capacity} onChange={handleChange} />
            <div className="md:col-span-2">
              <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1 font-medium">Mission / Description</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange}
                rows={4}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 outline-none transition-colors bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
              />
            </div>
          </div>
        </Card>

        <Card className="mb-6">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-700 mb-6">
             <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Operating Hours
             </h3>
             <span className="text-sm text-teal-600 dark:text-teal-400 font-medium">Open 7 days a week</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
               <div key={day} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{day}</span>
                  <span className="text-slate-500 text-sm">9:00 AM - 5:00 PM</span>
               </div>
             ))}
          </div>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button variant="ghost" type="button">Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
};
