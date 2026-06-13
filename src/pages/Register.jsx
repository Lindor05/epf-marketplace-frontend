import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { register as apiRegister } from '../services/auth.service';
import toast from 'react-hot-toast';

export default function Register() {
const {
    register, handleSubmit, watch,
    formState: { errors, isSubmitting },
} = useForm();
const navigate = useNavigate();

const onSubmit = async (data) => {
    try {
    await apiRegister(data);
    toast.success('Compte cree ! Connectez-vous.');
    navigate('/login');
    } catch (err) {
    const msg = err.response?.data?.message || 'Erreur lors de l inscription.';
    toast.error(msg);
    }
};

const f = 'mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500';

return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
    <div className='bg-white p-8 rounded-xl shadow-md w-full max-w-md'>
        <h1 className='text-2xl font-bold mb-6 text-gray-800'>Inscription</h1>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div>
            <label className='block text-sm font-medium text-gray-700'>Nom</label>
            <input {...register('name', { required: 'Nom obligatoire' })}
            className={f} placeholder='Votre nom' />
            {errors.name && <p className='text-red-500 text-xs mt-1'>{errors.name.message}</p>}
        </div>

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
            <input
            {...register('password', {
                required: 'Obligatoire',
                minLength: { value: 8, message: 'Minimum 8 caracteres' },
            })}
            type='password' className={f} />
            {errors.password && <p className='text-red-500 text-xs mt-1'>{errors.password.message}</p>}
        </div>

        <div>
            <label className='block text-sm font-medium text-gray-700'>
            Confirmer le mot de passe
            </label>
            <input
            {...register('password_confirmation', {
                required: 'Obligatoire',
                validate: v => v === watch('password') || 'Mots de passe differents',
            })}
            type='password' className={f} />
            {errors.password_confirmation && (
            <p className='text-red-500 text-xs mt-1'>
                {errors.password_confirmation.message}
            </p>
            )}
        </div>

        <div>
            <label className='block text-sm font-medium text-gray-700'>Role</label>
            <select {...register('role', { required: 'Role obligatoire' })} className={f}>
            <option value=''>Choisir un role</option>
            <option value='buyer'>Acheteur</option>
            <option value='seller'>Vendeur</option>
            </select>
            {errors.role && <p className='text-red-500 text-xs mt-1'>{errors.role.message}</p>}
        </div>

        <button type='submit' disabled={isSubmitting}
            className='w-full bg-indigo-600 text-white py-2 rounded-lg font-medium
            hover:bg-indigo-700 transition disabled:opacity-60'>
            {isSubmitting ? 'Inscription...' : "S'inscrire"}
        </button>
        </form>

        <p className='mt-4 text-sm text-center text-gray-600'>
        Deja un compte ?{' '}
        <Link to='/login' className='text-indigo-600 hover:underline'>Se connecter</Link>
        </p>
    </div>
    </div>
);
}

