import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
const { login } = useAuth();
const navigate  = useNavigate();

const onSubmit = async (data) => {
    try {
    const user = await login(data.email, data.password);
    toast.success(`Bienvenue ${user.name} !`);
      // Redirection selon le role
    if (user.role === 'admin')   navigate('/admin');
    else if (user.role === 'seller') navigate('/seller');
    else navigate('/');
    } catch {
    toast.error('Email ou mot de passe incorrect.');
    }
};

const f = 'mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500';

return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
    <div className='bg-white p-8 rounded-xl shadow-md w-full max-w-md'>
        <h1 className='text-2xl font-bold mb-6 text-gray-800'>Connexion</h1>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>

        <div>
            <label className='block text-sm font-medium text-gray-700'>Email</label>
            <input
            {...register('email', {
                required: 'Email obligatoire',
                pattern: { value: /^\S+@\S+$/i, message: 'Email invalide' },
            })}
            type='email' className={f} placeholder='vous@exemple.com' />
            {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email.message}</p>}
        </div>

        <div>
            <label className='block text-sm font-medium text-gray-700'>Mot de passe</label>
            <input {...register('password', { required: 'Obligatoire' })}
            type='password' className={f} />
            {errors.password && <p className='text-red-500 text-xs mt-1'>{errors.password.message}</p>}
        </div>

        <button type='submit' disabled={isSubmitting}
            className='w-full bg-indigo-600 text-white py-2 rounded-lg font-medium
            hover:bg-indigo-700 transition disabled:opacity-60'>
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
        </button>
        </form>

        <p className='mt-4 text-sm text-center text-gray-600'>
        Pas de compte ?{' '}
        <Link to='/register' className='text-indigo-600 hover:underline'>
            S inscrire
        </Link>
        </p>
    </div>
    </div>
);
}
