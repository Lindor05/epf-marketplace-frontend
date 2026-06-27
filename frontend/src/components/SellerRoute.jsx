import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function SellerRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to='/login' replace />
  if (user.role !== 'seller') return <Navigate to='/403' replace />
  return children
}
