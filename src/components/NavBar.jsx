import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
    setMenuOpen(false)
  }

  const links = user?.role === 'buyer' ? [
    { to: '/',          label: 'Produits' },
    { to: '/cart',      label: 'Panier' },
    { to: '/orders',    label: 'Mes commandes' },
    { to: '/favorites', label: 'Favoris' },
    { to: '/messages',  label: 'Messages' },
  ] : user?.role === 'seller' ? [
    { to: '/',                  label: 'Produits' },
    { to: '/seller/products',   label: 'Mes produits' },
    { to: '/seller/orders',     label: 'Commandes reçues' },
    { to: '/seller/dashboard',  label: 'Dashboard' },
  ] : user?.role === 'admin' ? [
    { to: '/admin/stats',    label: 'Stats' },
    { to: '/admin/users',    label: 'Utilisateurs' },
    { to: '/admin/products', label: 'Modération' },
    { to: '/admin/coupons',  label: 'Coupons' },
  ] : []

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

        <Link to="/" className="text-xl font-bold text-indigo-600">
          EPF Marketplace
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(link => (
            <Link key={link.to} to={link.to} className="text-gray-600 hover:text-indigo-600 text-sm">
              {link.label}
            </Link>
          ))}

          {!user && (
            <>
              <Link to="/login" className="text-gray-600 hover:text-indigo-600 text-sm">Connexion</Link>
              <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
                Inscription
              </Link>
            </>
          )}

          {user && (
            <div className="flex items-center gap-3 border-l pl-4 border-gray-200">
              <Link to="/profile" className="text-sm text-gray-700 hover:text-indigo-600">
                {user.name}
              </Link>
              <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700">
                Déconnexion
              </button>
            </div>
          )}
        </div>

        {/* Hamburger mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          <span className={`block w-6 h-0.5 bg-gray-600 transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gray-600 transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gray-600 transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Menu mobile déroulant */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="block text-gray-700 hover:text-indigo-600 text-sm py-1"
            >
              {link.label}
            </Link>
          ))}

          {!user && (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-gray-700 text-sm py-1">
                Connexion
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm text-center">
                Inscription
              </Link>
            </>
          )}

          {user && (
            <div className="border-t pt-3 space-y-2">
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-700">
                {user.name}
              </Link>
              <button onClick={handleLogout} className="block text-sm text-red-500">
                Déconnexion
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}