// src/pages/CategoryList.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCategories } from '../services/category.service'
import Spinner from '../components/Spinner'

export default function CategoryList() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getCategories()
      .then(res => setCategories(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Catégories</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map(cat => (
          <div
            key={cat.id}
            onClick={() => navigate(`/?category_id=${cat.id}`)}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center cursor-pointer hover:shadow-md hover:border-indigo-200 transition"
          >
            <p className="font-semibold text-gray-700">{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}