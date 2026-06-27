import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart, total } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [coupon, setCoupon] = useState('')
  const [loading, setLoading] = useState(false)
  const [showShipping, setShowShipping] = useState(false)
  const [shipping, setShipping] = useState({
    shipping_address: '',
    shipping_city: '',
    shipping_postal_code: '',
    shipping_phone: '',
  })

  const handleOrder = async (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    if (cart.length === 0) return toast.error('Votre panier est vide')

    setLoading(true)
    try {
      // 1. Sync le panier local vers le panier backend
      for (const item of cart) {
        await api.post('/cart/add', { product_id: item.id, quantity: item.quantity })
      }

      // 2. Créer la commande avec les infos de livraison
      await api.post('/orders', {
        ...shipping,
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
              alt={item.title ?? item.name}
              className="w-20 h-20 object-cover rounded-lg"
            />

            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{item.title ?? item.name}</h3>
              <p className="text-indigo-600 font-bold">{item.price} FCFA</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >−</button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <button
                disabled={item.quantity >= (item._stock ?? Infinity)}
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                title={item.quantity >= (item._stock ?? Infinity) ? 'Stock maximum atteint' : ''}
              >+</button>
            </div>

            <p className="w-28 text-right font-semibold text-gray-700">
              {(item.price * item.quantity).toFixed(0)} FCFA
            </p>

            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-400 hover:text-red-600 ml-2"
            >✕</button>
          </div>
        ))}
      </div>

      {/* Résumé + bouton commander */}
      {!showShipping ? (
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
            <span className="text-indigo-600">{total.toFixed(0)} FCFA</span>
          </div>

          <button
            onClick={() => { if (!user) return navigate('/login'); setShowShipping(true) }}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
          >
            Passer la commande
          </button>
        </div>
      ) : (
        /* Formulaire de livraison */
        <form onSubmit={handleOrder} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-800 text-lg">Informations de livraison</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input
              required
              value={shipping.shipping_address}
              onChange={e => setShipping(s => ({ ...s, shipping_address: e.target.value }))}
              placeholder="123 Rue de la Paix"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
              <input
                required
                value={shipping.shipping_city}
                onChange={e => setShipping(s => ({ ...s, shipping_city: e.target.value }))}
                placeholder="Dakar"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
              <input
                required
                value={shipping.shipping_postal_code}
                onChange={e => setShipping(s => ({ ...s, shipping_postal_code: e.target.value }))}
                placeholder="10000"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input
              required
              value={shipping.shipping_phone}
              onChange={e => setShipping(s => ({ ...s, shipping_phone: e.target.value }))}
              placeholder="06 00 00 00 00"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="flex items-center justify-between text-lg font-bold text-gray-800 border-t pt-4">
            <span>Total</span>
            <span className="text-indigo-600">{total.toFixed(0)} FCFA</span>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowShipping(false)}
              className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-lg font-semibold hover:bg-gray-50"
            >
              Retour
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-40"
            >
              {loading ? 'Commande en cours...' : 'Confirmer la commande'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
