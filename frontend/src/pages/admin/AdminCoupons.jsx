import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon }
from '../../services/admin.service';
import toast from 'react-hot-toast';

export default function AdminCoupons() {
const [coupons, setCoupons]   = useState([]);
const [loading, setLoading]   = useState(true);
const [editingId, setEditingId] = useState(null);
const [showForm, setShowForm] = useState(false);
const { register, handleSubmit, reset, setValue } = useForm();

const load = async () => {
    setLoading(true);
    try {
    const res = await getCoupons();
    setCoupons(res.data.data || res.data);
    } catch { toast.error('Erreur de chargement.'); }
    finally  { setLoading(false); }
};

useEffect(() => { load(); }, []);

const onSubmit = async (data) => {
    try {
    if (editingId) {
        await updateCoupon(editingId, data);
        toast.success('Coupon mis a jour !');
    } else {
        await createCoupon(data);
        toast.success('Coupon cree !');
    }
    reset(); setEditingId(null); setShowForm(false);
    load();
    } catch { toast.error('Erreur lors de la sauvegarde.'); }
};

const handleEdit = (c) => {
    setEditingId(c.id);
    Object.entries(c).forEach(([k, v]) => setValue(k, v));
    setShowForm(true);
};

const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce coupon ?')) return;
    try {
    await deleteCoupon(id);
    toast.success('Coupon supprime.');
    load();
    } catch { toast.error('Erreur.'); }
};

const f = 'mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500';

return (
    <div className='max-w-4xl mx-auto mt-8 p-6'>
    <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold'>Gestion des coupons</h1>
        <button
        onClick={() => { setShowForm(!showForm); setEditingId(null); reset(); }}
        className='bg-indigo-600 text-white px-4 py-2 rounded-lg
            hover:bg-indigo-700 transition text-sm'>
        {showForm ? 'Annuler' : '+ Nouveau coupon'}
        </button>
    </div>

    {showForm && (
        <form onSubmit={handleSubmit(onSubmit)}
        className='bg-white p-6 rounded-xl shadow-sm border mb-6 space-y-4'>
        <h2 className='font-semibold'>
            {editingId ? 'Modifier le coupon' : 'Nouveau coupon'}
        </h2>
        <div className='grid grid-cols-2 gap-4'>
            <div>
            <label className='block text-sm font-medium'>Code</label>
            <input {...register('code', { required: true })}
                className={f} placeholder='PROMO20' />
            </div>
            <div>
            <label className='block text-sm font-medium'>Reduction (%)</label>
            <input {...register('discount', { required: true })}
                type='number' min={1} max={100} className={f} />
            </div>
        </div>
        <div className='grid grid-cols-2 gap-4'>
            <div>
            <label className='block text-sm font-medium'>Date d expiration</label>
            <input {...register('expires_at')} type='date' className={f} />
            </div>
            <div>
            <label className='block text-sm font-medium'>Limite utilisation</label>
            <input {...register('usage_limit')} type='number' min={1}
                className={f} placeholder='ex : 100' />
            </div>
            </div>
        <button type='submit'
            className='bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition'>
            {editingId ? 'Mettre a jour' : 'Creer'}
        </button>
        </form>
    )}

    {loading ? (
        <div className='text-center py-12 text-gray-400'>Chargement...</div>
    ) : (
        <div className='space-y-3'>
        {coupons.map(c => (
            <div key={c.id}
            className='flex items-center justify-between p-4 bg-white
                rounded-xl shadow-sm border'>
            <div>
                <p className='font-mono font-bold text-indigo-700'>{c.code}</p>
                <p className='text-sm text-gray-500'>
                -{c.value ?? c.discount}% - Expire le{' '}
                {(c.ends_at ?? c.expires_at)
                    ? new Date(c.ends_at ?? c.expires_at).toLocaleDateString('fr-FR')
                    : 'jamais'}
                </p>
                <p className='text-xs text-gray-400'>
                Utilisations : {c.times_used ?? c.usage_count ?? 0} / {c.usage_limit ?? 'illimite'}
                </p>
            </div>
            <div className='flex gap-2'>
                <button onClick={() => handleEdit(c)}
                className='text-sm text-indigo-600 hover:underline px-2'>
                Modifier
                </button>
                <button onClick={() => handleDelete(c.id)}
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
