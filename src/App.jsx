import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './customer/context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './components/PrivateRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Login Pages
import CustomerLogin from './customer/pages/CustomerLogin';
import AdminLogin from './pages/AdminLogin';

// Admin Pages
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import Suppliers from './pages/Suppliers';
import Purchases from './pages/Purchases';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

// Customer Pages
import Home from './customer/pages/Home';
import Shop from './customer/pages/Shop';
import WineDetail from './customer/pages/WineDetail';
import Cart from './customer/pages/Cart';
import Register from './customer/pages/Register';
import MyOrders from './customer/pages/MyOrders';
import Contact from './customer/pages/Contact';
import Profile from './customer/pages/Profile';

// Page titles map
const pageTitles = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/categories': 'Categories',
  '/admin/inventory': 'Inventory',
  '/admin/customers': 'Customers',
  '/admin/orders': 'Orders',
  '/admin/payments': 'Payments',
  '/admin/suppliers': 'Suppliers',
  '/admin/purchases': 'Purchases',
  '/admin/reports': 'Reports',
  '/admin/settings': 'Settings',
};

// Admin layout wrapper
const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Admin';

  return (
    <div className="min-h-screen bg-dark-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Navbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 pt-16">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ThemeProvider>
          <Router>
            <Routes>

              {/* Default Route */}
              <Route path="/" element={<Home />} />

              {/* Customer Routes */}
              <Route path="/shop" element={<Shop />} />
              <Route path="/wine/:id" element={<WineDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/register" element={<Register />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<CustomerLogin />} />
              <Route path="/customer-login" element={<CustomerLogin />} />

              {/* Admin Login - no layout */}
              <Route path="/admin-login" element={<AdminLogin />} />

              {/* Admin Routes - with layout */}
              <Route path="/admin" element={
                <PrivateRoute>
                  <AdminLayout><Dashboard /></AdminLayout>
                </PrivateRoute>
              } />
              <Route path="/admin/products" element={
                <PrivateRoute>
                  <AdminLayout><Products /></AdminLayout>
                </PrivateRoute>
              } />
              <Route path="/admin/categories" element={
                <PrivateRoute>
                  <AdminLayout><Categories /></AdminLayout>
                </PrivateRoute>
              } />
              <Route path="/admin/customers" element={
                <PrivateRoute>
                  <AdminLayout><Customers /></AdminLayout>
                </PrivateRoute>
              } />
              <Route path="/admin/orders" element={
                <PrivateRoute>
                  <AdminLayout><Orders /></AdminLayout>
                </PrivateRoute>
              } />
              <Route path="/admin/inventory" element={
                <PrivateRoute>
                  <AdminLayout><Inventory /></AdminLayout>
                </PrivateRoute>
              } />
              <Route path="/admin/suppliers" element={
                <PrivateRoute>
                  <AdminLayout><Suppliers /></AdminLayout>
                </PrivateRoute>
              } />
              <Route path="/admin/purchases" element={
                <PrivateRoute>
                  <AdminLayout><Purchases /></AdminLayout>
                </PrivateRoute>
              } />
              <Route path="/admin/payments" element={
                <PrivateRoute>
                  <AdminLayout><Payments /></AdminLayout>
                </PrivateRoute>
              } />
              <Route path="/admin/reports" element={
                <PrivateRoute>
                  <AdminLayout><Reports /></AdminLayout>
                </PrivateRoute>
              } />
              <Route path="/admin/settings" element={
                <PrivateRoute>
                  <AdminLayout><Settings /></AdminLayout>
                </PrivateRoute>
              } />

              {/* Catch All */}
              <Route path="*" element={<Navigate to="/" />} />

            </Routes>
          </Router>
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;