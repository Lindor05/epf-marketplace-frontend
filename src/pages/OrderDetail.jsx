import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getOrder } from '../services/order.service'
import Spinner from '../components/Spinner'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped:   'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrder(id)
      .then(res => setOrder(res.data.order ?? res.data))
      .catch(() => {
          toast.error('Commande introuvable')
          navigate('/orders')
            })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Spinner />

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/orders')}
        className="text-sm text-gray-500 hover:text-indigo-600 mb-6"
      >
        ← Retour aux commandes
      </button>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Commande #{order.id}
          </h1>
          <span className={`text-sm px-3 py-1 rounded-full font-medium ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
            {order.status}
          </span>
        </div>

        <p className="text-sm text-gray-400 mb-6">
          Passée le {new Date(order.created_at).toLocaleDateString('fr-FR')}
        </p>

        <div className="space-y-3 mb-6">
          {order.items?.map(item => (
            <div key={item.id} className="flex items-center gap-4 border-b pb-3">
              <img
                src={item.product?.image ?? 'https://placehold.co/60x60?text=img'}
                alt={item.product?.name}
                className="w-14 h-14 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.product?.name}</p>
                <p className="text-sm text-gray-400">Quantité : {item.quantity}</p>
              </div>
              <p className="font-semibold text-indigo-600">
                {(item.price * item.quantity).toFixed(2)} €
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-lg font-bold text-gray-800 border-t pt-4">
          <span>Total</span>
          <span className="text-indigo-600">{order.total_price} €</span>
        </div>
      </div>
    </div>
  )
}