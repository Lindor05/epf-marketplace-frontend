import api from './api'

export const getProducts = (params = {}) =>
  api.get('/products', { params })

export const getProduct = (id) =>
  api.get(`/products/${id}`)

export const searchProducts = (query) =>
  api.get('/search', { params: { q: query } })

export const getMyProducts = () =>
  api.get('/products/my-products')