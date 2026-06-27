import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { createProduct } from '../../services/seller.service';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AddProduct() {
const { register, handleSubmit, formState: { errors } } = useForm();
const navigate = useNavigate();
const [categories, setCategories] = useState([]);
const [images, setImages]         = useState([]);

useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.data || r.data));
}, []);

const onSubmit = async (data) => {
    try {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => {
        if (v !== '' && v != null) fd.append(k, v);
    });
    images.forEach(img => fd.append('images[]', img));
    await createProduct(fd);
    toast.success('Produit cree !');
    navigate('/seller/products');
    } catch { toast.error('Erreur lors de la creation.'); }
};

const f = 'mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500';

return (
    <div className='max-w-2xl mx-auto mt-8 p-6 bg-white rounded-xl shadow'>
    <h1 className='text-2xl font-bold mb-6'>Ajouter un produit</h1>
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>

        <div>
        <label className='block text-sm font-medium'>Nom du produit</label>
        <input {...register('title', { required: 'Obligatoire' })}
            className={f} placeholder='Nom du produit' />
            {errors.title && <p className='text-red-500 text-xs mt-1'>{errors.title.message}</p>}
        </div>

        <div>
            <label className='block text-sm font-medium'>Description</label>
            <textarea {...register('description', { required: 'Obligatoire' })}
            rows={4} className={f} />
            {errors.description && (
            <p className='text-red-500 text-xs mt-1'>{errors.description.message}</p>
            )}
        </div>

        <div className='grid grid-cols-2 gap-4'>
            <div>
            <label className='block text-sm font-medium'>Prix (FCFA)</label>
            <input {...register('price', { required: 'Obligatoire', min: 0 })}
                type='number' className={f} />
            {errors.price && <p className='text-red-500 text-xs mt-1'>{errors.price.message}</p>}
            </div>
            <div>
            <label className='block text-sm font-medium'>Stock</label>
            <input {...register('quantity', { required: 'Obligatoire', min: 0 })}
                type='number' className={f} />
            {errors.quantity && <p className='text-red-500 text-xs mt-1'>{errors.quantity.message}</p>}
            </div>
        </div>

        <div>
            <label className='block text-sm font-medium'>Categorie</label>
            <select {...register('category_id', { required: 'Obligatoire' })} className={f}>
            <option value=''>Choisir une categorie</option>
            {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
            ))}
            </select>
            {errors.category_id && (
            <p className='text-red-500 text-xs mt-1'>{errors.category_id.message}</p>
            )}
        </div>

        <div>
            <label className='block text-sm font-medium'>
            Promo flash (optionnel, %)
            </label>
            <input {...register('flash_sale_discount')}
            type='number' min={0} max={100}
            className={f} placeholder='ex : 20 pour -20%' />
        </div>

        <div>
            <label className='block text-sm font-medium'>Images</label>
            <input type='file' multiple accept='image/*'
            onChange={e => setImages(Array.from(e.target.files))}
            className='mt-1 w-full' />
        </div>

        <div className='flex gap-3 pt-2'>
            <button type='submit'
            className='bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition'>
            Creer le produit
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
