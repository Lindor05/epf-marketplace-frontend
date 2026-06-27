import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../../services/admin.service';
import toast from 'react-hot-toast';

export default function AdminStats() {
const [stats, setStats]     = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
    getAdminStats()
    .then(r  => setStats(r.data))
    .catch(() => toast.error('Erreur de chargement.'))
    .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className='text-center py-12 text-gray-400'>Chargement...</div>;

    const KPI = [
    { label: 'Utilisateurs',    value: stats?.users_count    ?? '-' },
    { label: 'Produits',        value: stats?.products_count ?? '-' },
    { label: 'Commandes',       value: stats?.orders_count   ?? '-' },
    { label: 'Revenus totaux',  value: stats?.total_revenue != null ? `${stats.total_revenue} FCFA` : '-' },
    ];

    return (
    <div className='max-w-5xl mx-auto mt-8 p-6'>
        <h1 className='text-2xl font-bold mb-8'>
        Administration - Statistiques globales
        </h1>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-10'>
        {KPI.map(({ label, value }) => (
            <div key={label}
            className='bg-white rounded-xl p-5 shadow-sm border text-center'>
            <p className='text-3xl font-bold text-indigo-600'>{value}</p>
            <p className='text-sm text-gray-500 mt-2'>{label}</p>
            </div>
        ))}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {[
            { to: '/admin/users',    title: 'Utilisateurs',  desc: 'Suspendre ou reactiver des comptes' },
            { to: '/admin/products', title: 'Produits',      desc: 'Moderer et supprimer des produits' },
            { to: '/admin/coupons',  title: 'Coupons',       desc: 'Gerer les codes promotionnels' },
        ].map(({ to, title, desc }) => (
            <Link key={to} to={to}
            className='bg-white rounded-xl p-5 shadow-sm border hover:border-indigo-400 transition'>
            <p className='font-semibold text-gray-800'>{title}</p>
            <p className='text-sm text-gray-500 mt-1'>{desc}</p>
            </Link>
        ))}
        </div>
    </div>
    );
}
