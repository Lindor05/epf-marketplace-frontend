import { useState, useEffect } from 'react';
import { getSellerOrders } from '../../services/seller.service';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
pending:    'bg-yellow-100 text-yellow-700',
processing: 'bg-blue-100   text-blue-700',
shipped:    'bg-indigo-100 text-indigo-700',
delivered:  'bg-green-100  text-green-700',
cancelled:  'bg-red-100    text-red-700',
};

export default function SellerOrders() {
const [orders, setOrders]   = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
    getSellerOrders()
    .then(r => setOrders(r.data.data || r.data))
    .catch(()  => toast.error('Erreur de chargement.'))
    .finally(() => setLoading(false));
}, []);

return (
    <div className='max-w-4xl mx-auto mt-8 p-6'>
    <h1 className='text-2xl font-bold mb-6'>Commandes recues</h1>
    {loading ? (
        <div className='text-center py-12 text-gray-400'>Chargement...</div>
    ) : orders.length === 0 ? (
        <div className='text-center py-12 text-gray-400'>Aucune commande.</div>
    ) : (
        <div className='space-y-4'>
        {orders.map(order => (
            <div key={order.id}
            className='p-4 bg-white rounded-xl shadow-sm border'>
            <div className='flex items-center justify-between mb-2'>
                <p className='font-semibold'>Commande #{order.id}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'
                }`}>
                {order.status}
                </span>
            </div>
            <p className='text-sm text-gray-500'>Client : {order.user?.name}</p>
            <p className='text-sm text-gray-500'>Total : {order.total} FCFA</p>
            <p className='text-xs text-gray-400 mt-1'>
                {new Date(order.created_at).toLocaleDateString('fr-FR')}
            </p>
            {order.items && (
                <div className='mt-3 border-t pt-2 space-y-1'>
                {order.items.map(item => (
                    <div key={item.id}
                    className='text-xs text-gray-600 flex justify-between'>
                    <span>{item.product?.title ?? item.product?.name} x{item.quantity}</span>
                      <span>{item.price * item.quantity} FCFA</span>
                    </div>
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
