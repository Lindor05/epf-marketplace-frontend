import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart, total } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [coupon, setCoupon] = useState('')
  const [loading, setLoading] = useState(false)

  const handleOrder = async () => {
    if (!user) return navigate('/login')
    if (cart.length === 0) return toast.error('Votre panier est vide')

    setLoading(true)
    try {
      const items = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
      }))

      await api.post('/orders', {
        items,
        ...(coupon.trim() && { coupon_code: coupon.trim() }),
      })

      clearCart()
      toast.success('Commande passée avec succès !')
      navigate('/orders')
    } catch (err) {
      const msg = err.response?.data?.message || 'Erreur lors de la commande'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg mb-4">Votre panier est vide</p>
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mon panier</h1>

      <div className="space-y-4 mb-8">
        {cart.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4"
          >
            <img
              src={item.image ?? 'https://placehold.co/80x80?text=img'}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-lg"
            />

            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{item.name}</h3>
              <p className="text-indigo-600 font-bold">{item.price} €</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                −
              </button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                +
              </button>
            </div>

            <p className="w-20 text-right font-semibold text-gray-700">
              {(item.price * item.quantity).toFixed(2)} €
            </p>

            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-400 hover:text-red-600 ml-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Coupon + Total + Commander */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Code coupon (optionnel)"
            value={coupon}
            onChange={e => setCoupon(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="flex items-center justify-between text-lg font-bold text-gray-800 border-t pt-4">
          <span>Total</span>
          <span className="text-indigo-600">{total.toFixed(2)} €</span>
        </div>

        <button
          onClick={handleOrder}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-40"
        >
          {loading ? 'Commande en cours...' : 'Passer la commande'}
        </button>
      </div>
    </div>
  )
}