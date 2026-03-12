import api from './axios';

export const getAppointments = async () => {
  try {
    const response = await api.get('/appointments');
    return response.data;
  } catch (error) {
    console.warn("Using mock appointments data");
    return [
      { id: 1, patient: 'Bella', pet: 'Dog (Golden Retriever)', date: '2025-03-12T09:00:00Z', type: 'Checkup', status: 'confirmed' },
      { id: 2, patient: 'Luna', pet: 'Cat (Siamese)', date: '2025-03-12T10:30:00Z', type: 'Vaccination', status: 'pending' },
      { id: 3, patient: 'Charlie', pet: 'Dog (Bulldog)', date: '2025-03-12T13:00:00Z', type: 'Dental', status: 'completed' },
      { id: 4, patient: 'Milo', pet: 'Cat (Mixed)', date: '2025-03-13T09:30:00Z', type: 'Checkup', status: 'cancelled' },
      { id: 5, patient: 'Lucy', pet: 'Rabbit', date: '2025-03-13T11:00:00Z', type: 'Grooming', status: 'confirmed' },
    ];
  }
};

export const getPatients = async () => {
  try {
    const response = await api.get('/patients');
    return response.data;
  } catch (error) {
    return [
      { id: 1, name: 'Bella', owner: 'John Doe', age: '3 yrs', species: 'Dog', breed: 'Golden Retriever', lastVisit: '2025-02-15' },
      { id: 2, name: 'Luna', owner: 'Jane Smith', age: '2 yrs', species: 'Cat', breed: 'Siamese', lastVisit: '2025-01-20' },
      { id: 3, name: 'Charlie', owner: 'Mike Johnson', age: '5 yrs', species: 'Dog', breed: 'Bulldog', lastVisit: '2024-11-10' },
      { id: 4, name: 'Milo', owner: 'Sarah Williams', age: '1 yr', species: 'Cat', breed: 'Mixed', lastVisit: '2025-03-01' },
      { id: 5, name: 'Lucy', owner: 'Tom Brown', age: '2 yrs', species: 'Rabbit', breed: 'Mini Lop', lastVisit: '2024-12-05' },
    ];
  }
};
