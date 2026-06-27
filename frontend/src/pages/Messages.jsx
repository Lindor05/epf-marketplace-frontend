import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getConversations, getMessages, sendMessage } from '../services/message.service'
import { useAuth } from '../contexts/AuthContext'
import Spinner from '../components/Spinner'
import toast from 'react-hot-toast'

export default function Messages() {
  const { user }  = useAuth()
  const [conversations, setConversations] = useState([])
  const [messages, setMessages]           = useState([])
  const [selectedUser, setSelectedUser]   = useState(null)
  const [content, setContent]             = useState('')
  const [loading, setLoading]             = useState(true)
  const [sending, setSending]             = useState(false)
  const bottomRef = useRef(null)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    getConversations()
      .then(res => {
        const convs = res.data.data ?? res.data
        setConversations(convs)
        // Si on vient de "Contacter le vendeur" avec ?to=id&name=nom
        const toId   = searchParams.get('to')
        const toName = searchParams.get('name')
        if (toId) {
          const existing = convs.find(c => String(c.user?.id) === toId)
          setSelectedUser(existing?.user ?? { id: Number(toId), name: toName ?? 'Vendeur' })
        }
      })
      .catch(() => toast.error('Erreur de chargement des conversations'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedUser) return
    getMessages(selectedUser.id)
      .then(res => {
        const msgs = res.data.data ?? res.data
        setMessages([...msgs].reverse())
      })
      .catch(() => setMessages([]))
  }, [selectedUser])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!content.trim() || !selectedUser) return
    setSending(true)
    try {
      const res = await sendMessage(selectedUser.id, content.trim())
      const newMsg = res.data.message ?? res.data
      // L'API ne renvoie pas sender, on l'ajoute pour l'affichage immédiat
      setMessages(prev => [...prev, { ...newMsg, sender: { id: user?.id } }])
      setContent('')
    } catch {
      toast.error("Erreur lors de l'envoi")
    } finally {
      setSending(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <div className="flex gap-4 h-[75vh]">

      {/* Liste conversations */}
      <div className="w-64 bg-white rounded-xl border border-gray-100 shadow-sm overflow-y-auto flex-shrink-0">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-gray-800">Conversations</h2>
        </div>
        {conversations.length === 0 ? (
          <p className="text-sm text-gray-400 p-4">Aucune conversation</p>
        ) : (
          conversations.map((conv, i) => {
            const otherUser = conv.user
            const lastMsg   = conv.last_message?.content ?? ''
            return (
              <div
                key={i}
                onClick={() => setSelectedUser(otherUser)}
                className={`p-4 cursor-pointer hover:bg-gray-50 border-b transition ${
                  selectedUser?.id === otherUser?.id
                    ? 'bg-indigo-50 border-l-4 border-l-indigo-500'
                    : ''
                }`}
              >
                <p className="font-medium text-gray-700 text-sm">{otherUser?.name}</p>
                {lastMsg && (
                  <p className="text-xs text-gray-400 truncate mt-1">{lastMsg}</p>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Fil de messages */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm min-w-0">
        {!selectedUser ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Sélectionnez une conversation
          </div>
        ) : (
          <>
            <div className="p-4 border-b font-semibold text-gray-800">
              {selectedUser.name}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <p className="text-center text-gray-400 text-sm mt-8">
                  Aucun message. Dites bonjour !
                </p>
              )}
              {messages.map(msg => {
                const isMine = msg.sender?.id === user?.id
                return (
                  <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                      isMine
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t flex gap-2">
              <input
                type="text"
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Écrire un message..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                type="submit"
                disabled={sending || !content.trim()}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-40"
              >
                Envoyer
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
