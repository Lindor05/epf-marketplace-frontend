import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Forbidden() {
const { user } = useAuth();
const homeLink =
!user             ? '/login'   :
user.role === 'admin'  ? '/admin'   :
user.role === 'seller' ? '/seller'  :
'/';

return (
<div className='min-h-screen flex items-center justify-center bg-gray-50'>
    <div className='text-center'>
    <p className='text-8xl font-bold text-indigo-600 mb-4'>403</p>
    <h1 className='text-2xl font-bold text-gray-800 mb-2'>
        Vous n avez pas les droits
    </h1>
    <p className='text-gray-500 mb-8'>
        Cette page est reservee aux administrateurs.
    </p>
    <Link to={homeLink}
        className='bg-indigo-600 text-white px-6 py-2 rounded-lg
        hover:bg-indigo-700 transition'>
        Retourner a l accueil
    </Link>
    </div>
</div>
);
}
