import api from './api'

export const getConversations = () =>
  api.get('/messages')

export const getMessages = (userId) =>
  api.get(`/messages/${userId}`)

export const sendMessage = (receiverId, content) =>
  api.post('/messages', { receiver_id: receiverId, content })