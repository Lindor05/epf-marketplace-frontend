import api from './api'

export const getMyOrders = () =>
  api.get('/orders/my-orders')

export const getOrder = (id) =>
  api.get(`/orders/${id}`)