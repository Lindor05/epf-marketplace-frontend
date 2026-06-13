// Stub - sera remplace par la page catalogue de Luce
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6'>
      <h1 className='text-3xl font-bold text-indigo-600'>EPF Marketplace</h1>
      <p className='text-gray-500'>Bienvenue {user?.name || ''}</p>
      <div className='flex gap-4'>
        {!user && (
          <>
            <Link to='/login' className='bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700'>Se connecter</Link>
            <Link to='/register' className='border border-indigo-600 text-indigo-600 px-5 py-2 rounded-lg hover:bg-indigo-50'>S'inscrire</Link>
          </>
        )}
        {user?.role === 'seller' && <Link to='/seller' className='bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700'>Dashboard Vendeur</Link>}
        {user?.role === 'admin' && <Link to='/admin' className='bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700'>Dashboard Admin</Link>}
        {user && <Link to='/profile' className='border border-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-100'>Mon profil</Link>}
      </div>
    </div>
  );
}
