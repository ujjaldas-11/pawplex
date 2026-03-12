import API from './axios'

export const getStats = () =>
  API.get('/dashboard/stats/')

export const getCharts = () =>
  API.get('/dashboard/charts/')

export const getActivity = () =>
  API.get('/dashboard/activity/')
