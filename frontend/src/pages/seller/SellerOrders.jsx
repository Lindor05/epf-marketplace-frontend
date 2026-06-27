import { useState, useEffect } from 'react';
import { getSellerOrders } from '../../services/seller.service';
import api from '../../services/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  pending:    'bg-yellow-100 text-yellow-700',
  confirmed:  'bg-blue-100   text-blue-700',
  shipped:    'bg-indigo-100 text-indigo-700',
  delivered:  'bg-green-100  text-green-700',
  cancelled:  'bg-red-100    text-red-700',
};

const NEXT_STATUSES = {
  pending:   ['confirmed', 'cancelled'],
  confirmed: ['shipped',   'cancelled'],
  shipped:   ['delivered'],
  delivered: [],
  cancelled: [],
};

const STATUS_LABELS = {
  confirmed: 'Confirmer',
  shipped:   'Marquer Expédié',
  delivered: 'Marquer Livré',
  cancelled: 'Annuler',
};

export default function SellerOrders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    getSellerOrders()
      .then(r => setOrders(r.data.data || r.data))
      .catch(()  => toast.error('Erreur de chargement.'))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId)
    try {
      await api.put(`/orders/${orderId}/status`, { status })
      setOrders(prev => prev.map(o =>
        o.id === orderId ? { ...o, status } : o
      ))
      toast.success('Statut mis à jour !')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur de mise à jour')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className='max-w-4xl mx-auto mt-8 p-6'>
      <h1 className='text-2xl font-bold mb-6'>Commandes reçues</h1>
      {loading ? (
        <div className='text-center py-12 text-gray-400'>Chargement...</div>
      ) : orders.length === 0 ? (
        <div className='text-center py-12 text-gray-400'>Aucune commande.</div>
      ) : (
        <div className='space-y-4'>
          {orders.map(order => (
            <div key={order.id} className='p-4 bg-white rounded-xl shadow-sm border'>
              <div className='flex items-center justify-between mb-2'>
                <p className='font-semibold'>
                  {order.order_number ?? `Commande #${order.id}`}
                </p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'
                }`}>
                  {order.status}
                </span>
              </div>

              <p className='text-sm text-gray-500'>
                Client : {order.buyer?.name ?? order.user?.name ?? '—'}
              </p>
              {parseFloat(order.discount_amount) > 0 ? (
                <div className='text-sm flex items-center gap-2 flex-wrap'>
                  <span className='text-gray-400 line-through'>
                    {order.subtotal_before_discount} FCFA
                  </span>
                  <span className='text-green-600 text-xs bg-green-50 px-1.5 py-0.5 rounded'>
                    -{order.discount_amount} FCFA
                  </span>
                  <span className='font-semibold text-indigo-600'>
                    {order.total_amount} FCFA
                  </span>
                </div>
              ) : (
                <p className='text-sm font-semibold text-indigo-600'>
                  Total : {order.total_amount} FCFA
                </p>
              )}
              <p className='text-xs text-gray-400 mt-1'>
                {new Date(order.created_at).toLocaleDateString('fr-FR')}
              </p>

              {order.items?.length > 0 && (
                <div className='mt-3 border-t pt-2 space-y-1'>
                  {order.items.map((item, i) => (
                    <div key={item.id ?? i} className='text-xs text-gray-600 flex justify-between'>
                      <span>{item.product?.title ?? item.product?.name} x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              )}

              {NEXT_STATUSES[order.status]?.length > 0 && (
                <div className='mt-3 flex gap-2 flex-wrap'>
                  {NEXT_STATUSES[order.status].map(next => (
                    <button
                      key={next}
                      disabled={updating === order.id}
                      onClick={() => updateStatus(order.id, next)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition disabled:opacity-50 ${
                        next === 'cancelled'
                          ? 'border border-red-300 text-red-500 hover:bg-red-50'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {updating === order.id ? '...' : STATUS_LABELS[next]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
