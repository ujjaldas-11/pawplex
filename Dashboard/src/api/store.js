import api from './axios';

export const getInventory = async () => {
  try {
    const response = await api.get('/store/inventory');
    return response.data;
  } catch (error) {
    console.warn("Using mock inventory data");
    return [
      { id: 1, name: 'Premium Dog Food (15kg)', category: 'Food', sku: 'FOOD-D-15K', stock: 42, price: 45.99 },
      { id: 2, name: 'Cat Litter (Scented, 10kg)', category: 'Supplies', sku: 'SUPP-C-LIT', stock: 8, price: 18.50 },
      { id: 3, name: 'Chew Toy Ring', category: 'Toys', sku: 'TOY-D-RNG', stock: 105, price: 8.99 },
      { id: 4, name: 'Flea & Tick Treatment (Cats)', category: 'Health', sku: 'HLTH-C-FLE', stock: 0, price: 25.00 },
      { id: 5, name: 'Bird Seed Mix (5kg)', category: 'Food', sku: 'FOOD-B-MIX', stock: 15, price: 12.75 },
    ];
  }
};

export const getOrders = async () => {
  try {
    const response = await api.get('/store/orders');
    return response.data;
  } catch (error) {
    return [
      { id: 'ORD-1001', customer: 'John Doe', items: 3, total: 84.50, date: '2025-03-11T14:30:00Z', status: 'completed' },
      { id: 'ORD-1002', customer: 'Jane Smith', items: 1, total: 45.99, date: '2025-03-11T16:15:00Z', status: 'pending' },
      { id: 'ORD-1003', customer: 'Mike Johnson', items: 5, total: 120.25, date: '2025-03-10T09:45:00Z', status: 'completed' },
      { id: 'ORD-1004', customer: 'Sarah Williams', items: 2, total: 34.00, date: '2025-03-10T11:20:00Z', status: 'cancelled' },
      { id: 'ORD-1005', customer: 'Tom Brown', items: 4, total: 95.75, date: '2025-03-09T15:00:00Z', status: 'completed' },
    ];
  }
};
