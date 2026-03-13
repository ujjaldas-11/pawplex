import API from './axios'

export const getPets = () =>
  API.get('/pets/')

export const getPet = (id) =>
  API.get(`/pets/${id}/`)

export const createPet = (data) =>
  API.post('/pets/', data)

export const updatePet = (id, data) =>
  API.patch(`/pets/${id}/`, data)

export const deletePet = (id) =>
  API.delete(`/pets/${id}/`)

export const getPetQR = (id) =>
  API.get(`/pets/${id}/qr/`)

export const getHealthCard = (id) =>
  API.get(`/pets/${id}/health_card/`)

export const getVaccinations = (id) =>
  API.get(`/pets/${id}/vaccinations/`)

export const addVaccination = (id, data) =>
  API.post(`/pets/${id}/vaccinations/`, data)

export const getMedicalRecords = (id) =>
  API.get(`/pets/${id}/medical-records/`)

export const addMedicalRecord = (id, data) =>
  API.post(`/pets/${id}/medical-records/`, data)
