// Stub - sera remplace par la page detail produit de Luce
import { useParams, Link } from 'react-router-dom';

export default function ProductDetail() {
  const { id } = useParams();
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='text-center'>
        <p className='text-gray-400 mb-4'>Produit #{id} - Page en cours d'implementation</p>
        <Link to='/' className='text-indigo-600 hover:underline'>Retour accueil</Link>
      </div>
    </div>
  );
}
