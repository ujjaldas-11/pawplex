import api from './axios';

export const getListings = async () => {
  try {
    const response = await api.get('/adoption/');
    return response.data.map(item => ({
      id: item.id,
      name: item.pet_name,
      species: item.species,
      breed: item.breed || 'Unknown',
      age: `${item.age_months} mos`,
      status: item.status,
      photo: item.photo || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=200&auto=format&fit=crop'
    }));
  } catch (error) {
    console.warn("Using mock listings data");
    return [
      { id: 1, name: 'Max', species: 'Dog', breed: 'Labrador Mix', age: '2 yrs', status: 'available', photo: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=200&auto=format&fit=crop' },
      { id: 2, name: 'Whiskers', species: 'Cat', breed: 'Domestic Shorthair', age: '3 mos', status: 'pending', photo: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=200&auto=format&fit=crop' },
      { id: 3, name: 'Rocky', species: 'Dog', breed: 'German Shepherd', age: '4 yrs', status: 'adopted', photo: 'https://images.unsplash.com/photo-1589941013453-ec89f33b6e9e?q=80&w=200&auto=format&fit=crop' },
      { id: 4, name: 'Daisy', species: 'Cat', breed: 'Persian', age: '1 yr', status: 'available', photo: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=200&auto=format&fit=crop' },
      { id: 5, name: 'Buddy', species: 'Dog', breed: 'Beagle', age: '6 mos', status: 'available', photo: 'https://images.unsplash.com/photo-1537151608804-ea2d1c32ce07?q=80&w=200&auto=format&fit=crop' },
    ];
  }
};

export const getAdoptionRequests = async () => {
  try {
    const response = await api.get('/adoption/applications/');
    return response.data.map(req => ({
      id: req.id,
      applicant: req.requester_username || 'Unknown',
      email: 'Unknown',
      phone: 'Unknown',
      petName: 'Listing #' + req.listing,
      date: req.created_at,
      message: req.message,
      status: req.status
    }));
  } catch (error) {
    return [
      { id: 101, applicant: 'Alice Green', email: 'alice@example.com', phone: '+91 98765 00101', petName: 'Max', date: '2025-03-08', message: 'I have a large backyard and love Labradors.', status: 'pending' },
      { id: 102, applicant: 'Bob White', email: 'bob@example.com', phone: '+91 98765 00102', petName: 'Whiskers', date: '2025-03-09', message: 'Looking for a companion for my other cat.', status: 'approved' },
      { id: 103, applicant: 'Carol Black', email: 'carol@example.com', phone: '+91 98765 00103', petName: 'Rocky', date: '2025-03-05', message: 'Experienced with German Shepherds.', status: 'approved' },
      { id: 104, applicant: 'Dave Gray', email: 'dave@example.com', phone: '+91 98765 00104', petName: 'Daisy', date: '2025-03-10', message: 'I work from home and can give her lots of attention.', status: 'pending' },
      { id: 105, applicant: 'Eve Brown', email: 'eve@example.com', phone: '+91 98765 00105', petName: 'Buddy', date: '2025-03-02', message: 'Is he good with kids?', status: 'rejected' },
    ];
  }
};
