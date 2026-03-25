import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './customer/context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './components/PrivateRoute';

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

              {/* Admin Routes */}
              <Route path="/admin-login" element={<AdminLogin />} />

              <Route
                path="/admin"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              <Route
                path="/admin/products"
                element={
                  <PrivateRoute>
                    <Products />
                  </PrivateRoute>
                }
              />

              <Route
                path="/admin/categories"
                element={
                  <PrivateRoute>
                    <Categories />
                  </PrivateRoute>
                }
              />

              <Route
                path="/admin/customers"
                element={
                  <PrivateRoute>
                    <Customers />
                  </PrivateRoute>
                }
              />

              <Route
                path="/admin/orders"
                element={
                  <PrivateRoute>
                    <Orders />
                  </PrivateRoute>
                }
              />

              <Route
                path="/admin/inventory"
                element={
                  <PrivateRoute>
                    <Inventory />
                  </PrivateRoute>
                }
              />

              <Route
                path="/admin/suppliers"
                element={
                  <PrivateRoute>
                    <Suppliers />
                  </PrivateRoute>
                }
              />

              <Route
                path="/admin/purchases"
                element={
                  <PrivateRoute>
                    <Purchases />
                  </PrivateRoute>
                }
              />

              <Route
                path="/admin/payments"
                element={
                  <PrivateRoute>
                    <Payments />
                  </PrivateRoute>
                }
              />

              <Route
                path="/admin/reports"
                element={
                  <PrivateRoute>
                    <Reports />
                  </PrivateRoute>
                }
              />

              <Route
                path="/admin/settings"
                element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                }
              />

              {/* Catch All Route */}
              <Route path="*" element={<Navigate to="/" />} />

            </Routes>
          </Router>
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;