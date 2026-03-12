import { create } from 'zustand';

const DEMO_NOTIFICATIONS = [
  {
    id: 1,
    type: 'appointment',
    title: 'Vet: New Appointment',
    message: 'Checkup for Buster (Golden Retriever)',
    timestamp: '10 mins ago',
    read: false,
    role: 'vet'
  },
  {
    id: 2,
    type: 'inventory',
    title: 'Store: Low Stock',
    message: 'Premium Dog Food (Large Bag) running low.',
    timestamp: '2 hours ago',
    read: false,
    role: 'store'
  },
  {
    id: 3,
    type: 'adoption',
    title: 'Shelter: New Application',
    message: 'Michael Davis wants to adopt Luna.',
    timestamp: '5 hours ago',
    read: false,
    role: 'shelter'
  },
  {
    id: 4,
    type: 'system',
    title: 'Platform Update',
    message: 'PawCare+ version 2.1 is now live.',
    timestamp: '1 day ago',
    read: true,
    role: 'all'
  }
];

export const useNotificationStore = create((set) => ({
  notifications: DEMO_NOTIFICATIONS,
  markAsRead: (id) => set(state => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),
  markAllAsRead: () => set(state => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  }))
}));
