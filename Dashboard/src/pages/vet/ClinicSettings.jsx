import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const ClinicSettings = () => {
  const [formData, setFormData] = useState({
    name: 'City Vet Clinic',
    email: 'contact@cityvet.com',
    phone: '+91 91234 56789',
    address: '123 Main St, Springfield',
    hours: 'Mon-Fri: 8am - 6pm'
  });

  const [specialties, setSpecialties] = useState({
    general: true,
    surgery: true,
    dental: false,
    emergency: true,
    exotics: false,
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleSpecialty = (key) => {
    setSpecialties(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Simulate save
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-8">Clinic Settings</h1>

      <form onSubmit={handleSave}>
        <Card className="mb-6 space-y-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-700">
            General Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Clinic Name" name="name" value={formData.name} onChange={handleChange} />
            <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} />
            <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
            <Input label="Working Hours" name="hours" value={formData.hours} onChange={handleChange} />
            <div className="md:col-span-2">
              <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
            </div>
          </div>
        </Card>

        <Card className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-700 mb-6">
            Specialties Offered
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(specialties).map(([key, value]) => (
              <label key={key} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => toggleSpecialty(key)}
                  className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                />
                <span className="font-medium text-sm text-slate-700 dark:text-slate-300 capitalize">{key}</span>
              </label>
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
