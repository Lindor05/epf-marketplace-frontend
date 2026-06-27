import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyOrders } from '../services/order.service'
import Spinner from '../components/Spinner'
import ListSkeleton from '../components/ListSkeleton'

const STATUS_COLORS = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped:   'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getMyOrders()
      .then(res => setOrders(res.data.data ?? res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <ListSkeleton count={4} />

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg mb-4">Vous n'avez pas encore de commandes</p>
        <button
          onClick={() => navigate('/')}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
          Voir les produits
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mes commandes</h1>

      <div className="space-y-4">
        {orders.map(order => (
          <div
            key={order.id}
            onClick={() => navigate(`/orders/${order.id}`)}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 cursor-pointer hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-800">
                Commande #{order.id}
              </span>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                {order.status}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
              <span className="font-bold text-indigo-600">{order.total_price} €</span>
            </div>

            {order.items?.length > 0 && (
              <div className="mt-3 flex gap-2 flex-wrap">
                {order.items.map(item => (
                  <span key={item.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {item.product?.name} x{item.quantity}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}