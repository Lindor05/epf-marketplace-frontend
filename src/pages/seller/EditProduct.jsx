import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProduct, updateProduct } from '../../services/seller.service';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function EditProduct() {
const { id } = useParams();
const { register, handleSubmit, reset } = useForm();
const navigate = useNavigate();
const [categories, setCategories] = useState([]);
const [images, setImages]         = useState([]);
const [loading, setLoading]       = useState(true);

useEffect(() => {
    Promise.all([getProduct(id), api.get('/categories')])
    .then(([prodRes, catRes]) => {
        const p = prodRes.data;
        reset({
          ...p,
          category_id: p.category_id ?? p.category?.id,
        });
        setCategories(catRes.data.data || catRes.data);
        setLoading(false);
    })
    .catch(() => {
        toast.error('Erreur de chargement.');
        navigate('/seller/products');
    });
}, [id]);

const onSubmit = async (data) => {
    try {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => {
        if (v != null && v !== '') fd.append(k, v);
    });
    images.forEach(img => fd.append('images[]', img));
      fd.append('_method', 'PUT'); // requis par Laravel pour FormData
    await updateProduct(id, fd);
    toast.success('Produit mis a jour !');
    navigate('/seller/products');
    } catch { toast.error('Erreur lors de la mise a jour.'); }
};

const f = 'mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500';

if (loading) return <div className='text-center py-12'>Chargement...</div>;

return (
    <div className='max-w-2xl mx-auto mt-8 p-6 bg-white rounded-xl shadow'>
    <h1 className='text-2xl font-bold mb-6'>Modifier le produit</h1>
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div>
        <label className='block text-sm font-medium'>Nom</label>
        <input {...register('title')} className={f} />
        </div>
        <div>
        <label className='block text-sm font-medium'>Description</label>
        <textarea {...register('description')} rows={4} className={f} />
        </div>
        <div className='grid grid-cols-2 gap-4'>
        <div>
            <label className='block text-sm font-medium'>Prix (FCFA)</label>
            <input {...register('price')} type='number' className={f} />
        </div>
        <div>
            <label className='block text-sm font-medium'>Stock</label>
            <input {...register('quantity')} type='number' className={f} />
        </div>
        </div>
        <div>
        <label className='block text-sm font-medium'>Categorie</label>
        <select {...register('category_id')} className={f}>
            {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
            ))}
        </select>
        </div>
        <div>
        <label className='block text-sm font-medium'>
            Nouvelles images (optionnel)
        </label>
        <input type='file' multiple accept='image/*'
            onChange={e => setImages(Array.from(e.target.files))}
            className='mt-1 w-full' />
        </div>
        <div className='flex gap-3 pt-2'>
        <button type='submit'
            className='bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition'>
            Sauvegarder
        </button>
        <button type='button' onClick={() => navigate('/seller/products')}
            className='bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition'>
            Annuler
        </button>
        </div>
    </form>
    </div>
);
}
