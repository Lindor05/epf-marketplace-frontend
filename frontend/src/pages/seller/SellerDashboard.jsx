import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard, getStatistics } from '../../services/seller.service';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function SellerDashboard() {
const { user } = useAuth();
const [dashboard, setDashboard] = useState(null);
const [stats, setStats]         = useState(null);
const [loading, setLoading]     = useState(true);

useEffect(() => {
    Promise.all([getDashboard(), getStatistics()])
    .then(([dRes, sRes]) => { setDashboard(dRes.data); setStats(sRes.data); })
    .catch(()  => toast.error('Erreur de chargement.'))
    .finally(() => setLoading(false));
}, []);

if (loading) return <div className='text-center py-12 text-gray-400'>Chargement...</div>;

const KPI = [
    { label: 'Produits',       value: dashboard?.total_products ?? '-' },
    { label: 'Commandes',      value: dashboard?.total_orders   ?? '-' },
    { label: 'Revenus',        value: (dashboard?.total_revenue ?? dashboard?.total_sales) ? `${dashboard.total_revenue ?? dashboard.total_sales} FCFA` : '-' },
    { label: 'Ventes ce mois', value: dashboard?.monthly_sales?.length ?? stats?.monthly_sales ?? '-' },
];

return (
    <div className='max-w-4xl mx-auto mt-8 p-6'>
    <h1 className='text-2xl font-bold mb-1'>Bonjour, {user?.name}</h1>
    <p className='text-gray-500 mb-8'>Tableau de bord vendeur</p>

    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
        {KPI.map(({ label, value }) => (
        <div key={label}
            className='bg-white rounded-xl p-4 shadow-sm border text-center'>
            <p className='text-2xl font-bold text-indigo-600'>{value}</p>
            <p className='text-sm text-gray-500 mt-1'>{label}</p>
        </div>
        ))}
    </div>

    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Link to='/seller/products'
        className='flex items-center justify-center gap-2 bg-white
            rounded-xl p-5 shadow-sm border hover:border-indigo-400 transition'>
        <span className='font-medium'>Mes produits</span>
        </Link>
        <Link to='/seller/orders'
        className='flex items-center justify-center gap-2 bg-white
            rounded-xl p-5 shadow-sm border hover:border-indigo-400 transition'>
        <span className='font-medium'>Commandes recues</span>
        </Link>
        <Link to='/seller/products/new'
        className='flex items-center justify-center gap-2 bg-indigo-600
            text-white rounded-xl p-5 shadow-sm hover:bg-indigo-700 transition'>
        <span className='font-medium'>+ Nouveau produit</span>
        </Link>
    </div>
    </div>
);
}
