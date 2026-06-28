import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts, searchProducts } from '../services/product.service'
import { getCategories } from '../services/category.service'
import Skeleton from '../components/Skeleton'
import toast from 'react-hot-toast'

export default function Home() {
  const [products, setProducts]     = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [filters, setFilters]       = useState({
    category_id: '',
    min_price: '',
    max_price: '',
    sort: '',
    page: 1,
  })
  const [lastPage, setLastPage] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    getCategories()
      .then(res => setCategories(res.data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== '')
    )
    getProducts(params)
      .then(res => {
        setProducts(res.data.data ?? res.data)
        setLastPage(res.data.last_page ?? 1)
      })
      .finally(() => setLoading(false))
  }, [filters])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!search.trim()) return
    setLoading(true)
    searchProducts(search)
      .then(res => {
        // L'API renvoie { products: [...], sellers: [], categories: [] }
        const results = res.data.products ?? res.data.data ?? res.data
        setProducts(Array.isArray(results) ? results : [])
        if (!results?.length) toast('Aucun résultat trouvé', { icon: '🔍' })
      })
      .catch(() => toast.error('Erreur lors de la recherche'))
      .finally(() => setLoading(false))
  }

  const handleReset = () => {
    setSearch('')
    setFilters({ category_id: '', min_price: '', max_price: '', sort: '', page: 1 })
  }

  return (
    <div>
      {/* Barre de recherche */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          Rechercher
        </button>
        {search && (
          <button type="button" onClick={handleReset} className="text-gray-500 hover:text-gray-700 px-2">
            Réinitialiser
          </button>
        )}
      </form>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={filters.category_id}
          onChange={e => setFilters(f => ({ ...f, category_id: e.target.value, page: 1 }))}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Toutes les catégories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Prix min"
          value={filters.min_price}
          onChange={e => setFilters(f => ({ ...f, min_price: e.target.value, page: 1 }))}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-28"
        />

        <input
          type="number"
          placeholder="Prix max"
          value={filters.max_price}
          onChange={e => setFilters(f => ({ ...f, max_price: e.target.value, page: 1 }))}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-28"
        />

        <select
          value={filters.sort}
          onChange={e => setFilters(f => ({ ...f, sort: e.target.value, page: 1 }))}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Trier par</option>
          <option value="cheapest">Prix croissant</option>
          <option value="popular">Plus vendus</option>
          <option value="most_rated">Mieux notés</option>
          <option value="newest">Plus récents</option>
        </select>
      </div>

      {/* Grille produits */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-400 py-20">Aucun produit trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div
              key={product.id}
              onClick={() => navigate(`/products/${product.id}`)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition"
            >
              <img
                src={product.image ?? 'https://placehold.co/400x250?text=No+image'}
                alt={product.title ?? product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 truncate">
                  {product.title ?? product.name}
                </h3>
                <p className="text-indigo-600 font-bold mt-1">
                  {product.effective_price ?? product.price} FCFA
                </p>
                {product.status === 'sold' && (
                  <p className="text-xs text-red-400 mt-1">Rupture de stock</p>
                )}
                {product.seller && (
                  <p className="text-xs text-gray-400 mt-1">
                    Vendeur : {product.seller.name}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            disabled={filters.page === 1}
            onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-40 hover:bg-gray-50"
          >
            Précédent
          </button>
          <span className="px-4 py-2 text-sm text-gray-600">
            Page {filters.page} / {lastPage}
          </span>
          <button
            disabled={filters.page === lastPage}
            onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-40 hover:bg-gray-50"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  )
}
