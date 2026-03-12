import API from './axios'

export const getClinics = () =>
  API.get('/clinics/')

export const getSlots = (clinicId) =>
  API.get(`/clinics/${clinicId}/slots/`)

export const getAppointments = () =>
  API.get('/appointments/')

export const createAppointment = (data) =>
  API.post('/appointments/', data)

export const updateAppointmentStatus = (id, data) =>
  API.patch(`/appointments/${id}/update_status/`, data)
