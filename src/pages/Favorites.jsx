import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFavorites, removeFavorite } from '../services/favorite.service'
import { useCart } from '../contexts/CartContext'
import Spinner from '../components/Spinner'
import ProductCardSkeleton from '../components/ProductCardSkeleton'
import toast from 'react-hot-toast'

export default function Favorites() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    getFavorites()
      .then(res => setFavorites(res.data.data ?? res.data))
      .finally(() => setLoading(false))
  }, [])

  const handleRemove = async (productId) => {
    try {
      await removeFavorite(productId)
      setFavorites(prev => prev.filter(f => f.product_id !== productId))
      toast.success('Retiré des favoris')
    } catch {
      toast.error('Erreur lors de la suppression')
    }
  }

   if (loading) return <ProductCardSkeleton count={3} />

  if (favorites.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg mb-4">Aucun favori pour l'instant</p>
        <button
          onClick={() => navigate('/')}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
          Découvrir des produits
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mes favoris</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map(fav => (
          <div
            key={fav.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <img
              src={fav.product?.image ?? 'https://placehold.co/400x200?text=img'}
              alt={fav.product?.name}
              onClick={() => navigate(`/products/${fav.product_id}`)}
              className="w-full h-44 object-cover cursor-pointer hover:opacity-90 transition"
            />
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-gray-800 truncate">{fav.product?.name}</h3>
              <p className="text-indigo-600 font-bold">{fav.product?.price} €</p>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => {
                    addToCart(fav.product)
                    toast.success('Ajouté au panier !')
                  }}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm hover:bg-indigo-700"
                >
                  Ajouter au panier
                </button>
                <button
                  onClick={() => handleRemove(fav.product_id)}
                  className="px-3 py-2 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 text-sm"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}