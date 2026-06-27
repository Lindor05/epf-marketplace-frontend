import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className='bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between'>
      <div className='flex items-center gap-6'>
        <Link to='/' className='text-indigo-600 font-bold text-lg'>EPF Marketplace</Link>

        {user.role === 'seller' && (
          <>
            <Link to='/seller' className='text-sm text-gray-600 hover:text-indigo-600 transition'>Dashboard</Link>
            <Link to='/seller/products' className='text-sm text-gray-600 hover:text-indigo-600 transition'>Mes produits</Link>
            <Link to='/seller/orders' className='text-sm text-gray-600 hover:text-indigo-600 transition'>Commandes</Link>
          </>
        )}

        {user.role === 'admin' && (
          <>
            <Link to='/admin' className='text-sm text-gray-600 hover:text-indigo-600 transition'>Statistiques</Link>
            <Link to='/admin/users' className='text-sm text-gray-600 hover:text-indigo-600 transition'>Utilisateurs</Link>
            <Link to='/admin/products' className='text-sm text-gray-600 hover:text-indigo-600 transition'>Produits</Link>
            <Link to='/admin/coupons' className='text-sm text-gray-600 hover:text-indigo-600 transition'>Coupons</Link>
          </>
        )}

        {user.role === 'buyer' && (
          <Link to='/' className='text-sm text-gray-600 hover:text-indigo-600 transition'>Catalogue</Link>
        )}
      </div>

      <div className='flex items-center gap-4'>
        <Link to='/profile' className='text-sm text-gray-600 hover:text-indigo-600 transition'>
          {user.name}
        </Link>
        <button
          onClick={handleLogout}
          className='text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition'>
          Déconnexion
        </button>
      </div>
    </nav>
  );
}
