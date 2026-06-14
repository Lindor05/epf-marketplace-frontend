import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProduct } from '../services/product.service'
import Spinner from '../components/Spinner'
import { useCart } from '../contexts/CartContext'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    getProduct(id)
      .then(res => setProduct(res.data.product ?? res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Spinner />

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 hover:text-indigo-600 mb-6 flex items-center gap-1"
      >
        ← Retour
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <img
          src={product.image ?? 'https://placehold.co/800x400?text=No+image'}
          alt={product.name}
          className="w-full h-72 object-cover"
        />

        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
            <span className="text-2xl font-bold text-indigo-600">{product.price} €</span>
          </div>

          <p className="text-gray-600">{product.description}</p>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className={product.stock > 0 ? 'text-green-600' : 'text-red-500'}>
              {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
            </span>
            {product.category && (
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                {product.category.name}
              </span>
            )}
          </div>

          {/* Avis */}
          {product.reviews?.length > 0 && (
            <div className="border-t pt-4 mt-4">
              <h2 className="font-semibold text-gray-700 mb-3">Avis clients</h2>
              <div className="space-y-3">
                {product.reviews.map(review => (
                  <div key={review.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {review.user?.name ?? 'Anonyme'}
                      </span>
                      <span className="text-yellow-500 text-sm">{'★'.repeat(review.rating)}</span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-gray-500 mt-1">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

<button
  disabled={product.stock === 0}
  onClick={() => {
    addToCart(product)
    toast.success('Produit ajouté au panier !')
  }}
  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed mt-4"
>
  Ajouter au panier
</button>
        </div>
      </div>
    </div>
  )
}