import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute  from './components/AdminRoute';
import Layout from './components/Layout';

// Pages publiques
import Home          from './pages/Home';
import Login         from './pages/Login';
import Register      from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Forbidden     from './components/Forbidden';
import CategoryList  from './pages/CategoryList';

// Pages privées buyer
import Cart        from './pages/Cart';
import Orders      from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Favorites   from './pages/Favorites';
import Messages    from './pages/Messages';

// Profil
import Profile from './pages/Profile';

// Seller
import SellerDashboard from './pages/seller/SellerDashboard';
import MyProducts      from './pages/seller/MyProducts';
import AddProduct      from './pages/seller/AddProduct';
import EditProduct     from './pages/seller/EditProduct';
import SellerOrders    from './pages/seller/SellerOrders';

// Admin
import AdminStats    from './pages/admin/AdminStats';
import AdminUsers    from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCoupons  from './pages/admin/AdminCoupons';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster position='top-right' />
          <Layout>
            <Routes>

              {/* Public */}
              <Route path='/'             element={<Home />} />
              <Route path='/login'        element={<Login />} />
              <Route path='/register'     element={<Register />} />
              <Route path='/products/:id' element={<ProductDetail />} />
              <Route path='/categories'   element={<CategoryList />} />
              <Route path='/403'          element={<Forbidden />} />

              {/* Prive */}
              <Route path='/profile' element={
                <PrivateRoute><Profile /></PrivateRoute>
              } />
              <Route path='/cart' element={
                <PrivateRoute><Cart /></PrivateRoute>
              } />
              <Route path='/orders' element={
                <PrivateRoute><Orders /></PrivateRoute>
              } />
              <Route path='/orders/:id' element={
                <PrivateRoute><OrderDetail /></PrivateRoute>
              } />
              <Route path='/favorites' element={
                <PrivateRoute><Favorites /></PrivateRoute>
              } />
              <Route path='/messages' element={
                <PrivateRoute><Messages /></PrivateRoute>
              } />

              {/* Seller */}
              <Route path='/seller' element={
                <PrivateRoute><SellerDashboard /></PrivateRoute>
              } />
              <Route path='/seller/products' element={
                <PrivateRoute><MyProducts /></PrivateRoute>
              } />
              <Route path='/seller/products/new' element={
                <PrivateRoute><AddProduct /></PrivateRoute>
              } />
              <Route path='/seller/products/:id/edit' element={
                <PrivateRoute><EditProduct /></PrivateRoute>
              } />
              <Route path='/seller/orders' element={
                <PrivateRoute><SellerOrders /></PrivateRoute>
              } />
              <Route path='/seller/dashboard' element={
                <PrivateRoute><SellerDashboard /></PrivateRoute>
              } />

              {/* Admin */}
              <Route path='/admin' element={
                <AdminRoute><AdminStats /></AdminRoute>
              } />
              <Route path='/admin/stats' element={
                <AdminRoute><AdminStats /></AdminRoute>
              } />
              <Route path='/admin/users' element={
                <AdminRoute><AdminUsers /></AdminRoute>
              } />
              <Route path='/admin/products' element={
                <AdminRoute><AdminProducts /></AdminRoute>
              } />
              <Route path='/admin/coupons' element={
                <AdminRoute><AdminCoupons /></AdminRoute>
              } />

            </Routes>
          </Layout>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
