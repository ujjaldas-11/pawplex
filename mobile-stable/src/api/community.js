import API from './axios'

export const getPosts = () =>
  API.get('/community/posts/')

export const createPost = (data) => {
  // Support FormData for image uploads
  const headers = data instanceof FormData
    ? { 'Content-Type': 'multipart/form-data' }
    : {}
  return API.post('/community/posts/', data, { headers })
}

export const likePost = (id) =>
  API.post(`/community/posts/${id}/like/`)

export const getComments = (id) =>
  API.get(`/community/posts/${id}/comments/`)

export const addComment = (id, data) =>
  API.post(`/community/posts/${id}/comments/`, data)

export const toggleFollow = (userId) =>
  API.post(`/community/follow/${userId}/`)
