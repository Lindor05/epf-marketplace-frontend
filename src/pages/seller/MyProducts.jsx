import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyProducts, deleteProduct } from '../../services/seller.service';
import toast from 'react-hot-toast';

const FILTERS = ['all', 'draft', 'published', 'sold'];

const statusClass = s => ({
published: 'bg-green-100 text-green-700',
draft:     'bg-yellow-100 text-yellow-700',
sold:      'bg-gray-100 text-gray-600',
}[s] || 'bg-gray-100 text-gray-600');

export default function MyProducts() {
const [products, setProducts] = useState([]);
const [loading, setLoading]   = useState(true);
const [status, setStatus]     = useState('all');

const load = async () => {
    setLoading(true);
    try {
    const params = status !== 'all' ? { status } : {};
    const res = await getMyProducts(params);
    setProducts(res.data.data || res.data);
    } catch { toast.error('Erreur de chargement.'); }
    finally  { setLoading(false); }
};

useEffect(() => { load(); }, [status]);

const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce produit ?')) return;
    try {
    await deleteProduct(id);
    toast.success('Produit supprime !');
    load();
    } catch { toast.error('Erreur.'); }
};

return (
    <div className='max-w-4xl mx-auto mt-8 p-6'>
    <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold'>Mes produits</h1>
        <Link to='/seller/products/new'
        className='bg-indigo-600 text-white px-4 py-2 rounded-lg
            hover:bg-indigo-700 transition text-sm'>
        + Ajouter un produit
        </Link>
    </div>

      {/* Filtres */}
    <div className='flex gap-2 mb-6'>
        {FILTERS.map(s => (
        <button key={s} onClick={() => setStatus(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
            status === s
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-400'
            }`}>
            {s === 'all' ? 'Tous' : s}
        </button>
        ))}
    </div>

    {loading ? (
        <div className='text-center py-12 text-gray-400'>Chargement...</div>
    ) : products.length === 0 ? (
        <div className='text-center py-12 text-gray-400'>Aucun produit.</div>
    ) : (
        <div className='space-y-3'>
        {products.map(p => (
            <div key={p.id}
            className='flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border'>
            <div>
                <p className='font-semibold text-gray-800'>{p.title ?? p.name}</p>
                <p className='text-sm text-gray-500'>{p.price} FCFA - Stock : {p.quantity ?? p.stock}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusClass(p.status)}`}>
                {p.status}
                </span>
            </div>
            <div className='flex gap-2'>
                <Link to={`/seller/products/${p.id}/edit`}
                className='text-sm text-indigo-600 hover:underline px-2'>
                Modifier
                </Link>
                <button onClick={() => handleDelete(p.id)}
                className='text-sm text-red-500 hover:underline px-2'>
                Supprimer
                </button>
            </div>
            </div>
        ))}
        </div>
    )}
    </div>
);
}
