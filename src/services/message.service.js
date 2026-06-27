import api from './api'

export const getConversations = () =>
  api.get('/messages/conversations')

export const getMessages = (userId) =>
  api.get(`/messages/with/${userId}`)

export const sendMessage = (receiverId, content) =>
  api.post('/messages', { recipient_id: receiverId, content })