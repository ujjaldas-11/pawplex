import API from './axios'

export const getAdoptionListings = (params) =>
  API.get('/adoption/', { params })

export const getAdoptionListing = (id) =>
  API.get(`/adoption/${id}/`)

export const expressInterest = (id, data) =>
  API.post(`/adoption/${id}/interest/`, data)

export const getLostFound = (params) =>
  API.get('/lost-found/', { params })

export const createLostFound = (data) =>
  API.post('/lost-found/', data)

export const resolveLostFound = (id) =>
  API.patch(`/lost-found/${id}/resolve/`)
