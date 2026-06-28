import { useState, useEffect } from 'react';
import { getAllProducts, forceProductStatus, forceDeleteProduct }
from '../../services/admin.service';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['draft', 'published', 'sold', 'inactive'];
const statusClass = s => ({
published: 'bg-green-100 text-green-700',
draft:     'bg-yellow-100 text-yellow-700',
sold:      'bg-gray-100 text-gray-600',
}[s] || 'bg-gray-100 text-gray-600');

export default function AdminProducts() {
const [products, setProducts] = useState([]);
const [loading, setLoading]   = useState(true);

const load = async () => {
    setLoading(true);
    try {
    const res = await getAllProducts();
    setProducts(res.data.data || res.data);
    } catch { toast.error('Erreur de chargement.'); }
    finally  { setLoading(false); }
};

useEffect(() => { load(); }, []);

const handleStatus = async (id, status) => {
    try {
    await forceProductStatus(id, status);
    toast.success('Statut mis a jour.');
    load();
    } catch { toast.error('Erreur.'); }
};

const handleDelete = async (id) => {
    if (!window.confirm('Supprimer definitivement ce produit ?')) return;
    try {
    await forceDeleteProduct(id);
    toast.success('Produit supprime.');
    load();
    } catch { toast.error('Erreur.'); }
};

return (
    <div className='max-w-4xl mx-auto mt-8 p-6'>
    <h1 className='text-2xl font-bold mb-6'>Moderation des produits</h1>
    {loading ? (
        <div className='text-center py-12 text-gray-400'>Chargement...</div>
    ) : (

        <div className='space-y-4'>
        {products.map(p => (
            <div key={p.id}
            className='flex items-center justify-between p-4 bg-white
                rounded-xl shadow-sm border'>
            <div>
                <p className='font-semibold text-gray-800'>{p.title ?? p.name}</p>
                <p className='text-sm text-gray-500'>
                Vendeur : {p.seller?.name} - {p.price} FCFA
                </p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                mt-1 inline-block ${statusClass(p.status)}`}>
                {p.status}
                </span>
            </div>
            <div className='flex items-center gap-2'>
                <select value={p.status}
                onChange={e => handleStatus(p.id, e.target.value)}
                className='text-sm border rounded-lg px-2 py-1
                    focus:outline-none focus:ring-2 focus:ring-indigo-500'>
                {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                ))}
                </select>
                <button onClick={() => handleDelete(p.id)}
                className='text-sm text-red-500 hover:text-red-700 px-2'>
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
