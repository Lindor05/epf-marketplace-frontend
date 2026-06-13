import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile } from '../services/auth.service';
import toast from 'react-hot-toast';

export default function Profile() {
const { user, logout, refreshUser } = useAuth();
const { register, handleSubmit, reset } = useForm();
const [editing, setEditing]     = useState(false);
const [avatarFile, setAvatarFile] = useState(null);

useEffect(() => {
    if (user) reset(user);
}, [user, reset]);

const onSubmit = async (data) => {
    try {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => {
        if (v != null) fd.append(k, v);
    });
    if (avatarFile) fd.append('profile_image', avatarFile);
    await updateProfile(fd);
    await refreshUser();
    toast.success('Profil mis a jour !');
    setEditing(false);
    } catch {
    toast.error('Erreur lors de la mise a jour.');
    }
};

const f = 'mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500';

return (
    <div className='max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow'>
    <div className='flex items-center justify-between mb-6'>
    <h1 className='text-2xl font-bold text-gray-800'>Mon profil</h1>
        <button onClick={() => setEditing(!editing)}
        className='text-sm text-indigo-600 hover:underline'>
        {editing ? 'Annuler' : 'Modifier'}
        </button>
    </div>

    {!editing ? (
        <div className='space-y-3 text-gray-700'>
        <p><span className='font-medium'>Nom :</span> {user?.name}</p>
        <p><span className='font-medium'>Email :</span> {user?.email}</p>
        <p><span className='font-medium'>Ville :</span> {user?.city || '-'}</p>
        <p><span className='font-medium'>Bio :</span> {user?.bio  || '-'}</p>
        <p><span className='font-medium'>Role :</span> {user?.role}</p>
        {user?.avatar && (
            <img src={user.avatar} alt='avatar'
            className='w-20 h-20 rounded-full object-cover mt-2' />
        )}
        </div>
    ) : (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div>
            <label className='block text-sm font-medium'>Nom</label>
            <input {...register('name')} className={f} />
        </div>
        <div>
            <label className='block text-sm font-medium'>Ville</label>
            <input {...register('city')} className={f} />
        </div>
        <div>
            <label className='block text-sm font-medium'>Bio</label>
            <textarea {...register('bio')} rows={3} className={f} />
        </div>
        <div>
            <label className='block text-sm font-medium'>Avatar</label>
            <input type='file' accept='image/*'
            onChange={e => setAvatarFile(e.target.files[0])}
            className='mt-1 w-full' />
        </div>
        <button type='submit'
            className='bg-indigo-600 text-white px-6 py-2 rounded-lg
            hover:bg-indigo-700 transition'>
            Sauvegarder
        </button>
        </form>
    )}

    <button onClick={logout}
        className='mt-8 text-sm text-red-500 hover:underline'>
        Se deconnecter
    </button>
    </div>
);
}
