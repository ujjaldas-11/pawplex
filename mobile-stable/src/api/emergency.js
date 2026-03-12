import API from './axios'

export const triggerSOS = (data) =>
  API.post('/emergency/sos/', data)

export const getSOSList = () =>
  API.get('/emergency/sos/list/')

export const resolveSOS = (id) =>
  API.patch(`/emergency/sos/${id}/resolve/`)

export const getNearbyVets = (lat, lng) =>
  API.get('/emergency/nearby/', { params: { lat, lng } })

export const getContacts = () =>
  API.get('/emergency/contacts/')

export const createContact = (data) =>
  API.post('/emergency/contacts/', data)
