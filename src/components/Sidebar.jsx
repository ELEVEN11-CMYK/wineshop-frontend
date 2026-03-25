import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/products', label: 'Products', icon: '🍾' },
  { path: '/admin/categories', label: 'Categories', icon: '📂' },
  { path: '/admin/inventory', label: 'Inventory', icon: '📦' },
  { path: '/admin/customers', label: 'Customers', icon: '👥' },
  { path: '/admin/orders', label: 'Orders', icon: '🛒' },
  { path: '/admin/payments', label: 'Payments', icon: '💳' },
  { path: '/admin/suppliers', label: 'Suppliers', icon: '🏭' },
  { path: '/admin/purchases', label: 'Purchases', icon: '📋' },
  { path: '/admin/reports', label: 'Reports', icon: '📈' },
  { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-screen w-64 bg-dark-200 border-r border-gray-800 flex flex-col z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>

        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🍷</span>
              <div>
                <h1 className="text-white font-bold text-lg">Wine Shop</h1>
                <p className="text-gray-500 text-xs">Management System</p>
              </div>
            </div>
            {/* Close button - mobile only */}
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-white text-xl p-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-wine-700 flex items-center justify-center text-white font-bold">
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{user?.fullName}</p>
              <p className="text-gray-500 text-xs">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full text-left sidebar-link text-red-400 hover:bg-red-900/30 hover:text-red-300"
          >
            <span className="text-xl">🚪</span>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;