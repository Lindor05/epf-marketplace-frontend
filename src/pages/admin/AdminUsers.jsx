import { useState, useEffect } from 'react';
import { getAdminUsers, suspendUser, reactivateUser } from '../../services/admin.service';
import toast from 'react-hot-toast';

export default function AdminUsers() {
const [users, setUsers]     = useState([]);
const [loading, setLoading] = useState(true);
const [search, setSearch]   = useState('');

const load = async () => {
    setLoading(true);
    try {
    const params = search ? { search } : {};
    const res = await getAdminUsers(params);
    setUsers(res.data.data || res.data);
    } catch { toast.error('Erreur de chargement.'); }
    finally  { setLoading(false); }
};

useEffect(() => { load(); }, []);

const handleToggle = async (u) => {
    try {
    if (u.suspended_at) {
        await reactivateUser(u.id);
        toast.success(`${u.name} reactivee.`);
    } else {
        await suspendUser(u.id);
        toast.success(`${u.name} suspendue.`);
    }
    load();
    } catch { toast.error('Erreur.'); }
};

return (
    <div className='max-w-4xl mx-auto mt-8 p-6'>
    <h1 className='text-2xl font-bold mb-6'>Gestion des utilisateurs</h1>

    <div className='flex gap-3 mb-6'>
        <input type='text' placeholder='Rechercher...'
        value={search}
        onChange={e => setSearch(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && load()}
        className='flex-1 border rounded-lg px-3 py-2
            focus:outline-none focus:ring-2 focus:ring-indigo-500' />
        <button onClick={load}
        className='bg-indigo-600 text-white px-4 py-2 rounded-lg
            hover:bg-indigo-700 transition text-sm'>
        Rechercher
        </button>
    </div>

    {loading ? (
        <div className='text-center py-12 text-gray-400'>Chargement...</div>
    ) : (
        <div className='space-y-3'>
        {users.map(u => (
            <div key={u.id}
            className='flex items-center justify-between p-4 bg-white
                rounded-xl shadow-sm border'>
            <div>
                <p className='font-semibold text-gray-800'>{u.name}</p>
                <p className='text-sm text-gray-500'>{u.email} - {u.role}</p>
                {u.suspended_at && (
                <span className='text-xs text-red-500 font-medium'>Suspendu</span>
                )}
            </div>
            <button onClick={() => handleToggle(u)}
                className={`text-sm px-4 py-1.5 rounded-lg font-medium transition ${
                u.suspended_at
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}>
                {u.suspended_at ? 'Reactiver' : 'Suspendre'}
            </button>
            </div>
        ))}
        </div>
    )}
    </div>
);
}
