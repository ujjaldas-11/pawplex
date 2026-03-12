import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Mail, Briefcase, User, MapPin, Phone, Shield } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+91 98765 43210',
    location: 'Metropolis, NY',
    bio: 'Passionate about animal welfare and providing the best care possible.'
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // In a real app, dispatch an update to the backend/store here
  };

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'vet': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'shelter': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'store': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Profile</h1>
        <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? 'ghost' : 'primary'}>
          {isEditing ? 'Cancel Editor' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Quick Info */}
        <Card className="md:col-span-1 flex flex-col items-center text-center p-8">
          <div className="w-32 h-32 rounded-full bg-teal-100 dark:bg-teal-900/50 flex flex-col items-center justify-center text-teal-700 dark:text-teal-400 font-bold text-4xl mb-6 shadow-sm border-4 border-white dark:border-slate-800 relative">
            {user?.name?.[0]?.toUpperCase() || 'U'}
            <div className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center bg-teal-500`}>
              <Shield className="w-3 h-3 text-white" />
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">{formData.name}</h2>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize tracking-wide mb-4 ${getRoleBadgeColor(user?.role)}`}>
            {user?.role || 'Guest'} Account
          </span>
          
          <div className="w-full pt-4 mt-2 border-t border-slate-100 dark:border-slate-700 space-y-3 text-left">
            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
              <Mail className="w-4 h-4 mr-3 text-slate-400" />
              <span className="truncate">{formData.email}</span>
            </div>
            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
              <Phone className="w-4 h-4 mr-3 text-slate-400" />
              <span>{formData.phone}</span>
            </div>
            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
              <MapPin className="w-4 h-4 mr-3 text-slate-400" />
              <span>{formData.location}</span>
            </div>
          </div>
        </Card>

        {/* Right Column: Details & Edit Form */}
        <Card className="md:col-span-2">
          <div className="border-b border-slate-100 dark:border-slate-700 pb-4 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {isEditing ? 'Edit Information' : 'Personal Information'}
            </h3>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} required />
                <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
                <Input label="Location" name="location" value={formData.location} onChange={handleChange} />
              </div>
              
              <div>
                <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1 font-medium">Bio / About Me</label>
                <textarea 
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 outline-none transition-colors bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Full Name</h4>
                  <p className="text-slate-900 dark:text-slate-100">{formData.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Email Address</h4>
                  <p className="text-slate-900 dark:text-slate-100">{formData.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Phone Number</h4>
                  <p className="text-slate-900 dark:text-slate-100">{formData.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Location</h4>
                  <p className="text-slate-900 dark:text-slate-100">{formData.location}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Bio</h4>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                    {formData.bio}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
