import api from './api'

export const getFavorites = () =>
  api.get('/favorites')

export const addFavorite = (productId) =>
  api.post('/favorites', { product_id: productId })

export const removeFavorite = (productId) =>
  api.delete(`/favorites/${productId}`)