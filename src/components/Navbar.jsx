import { useAuth } from '../context/AuthContext';

const Navbar = ({ title }) => {
  const { user } = useAuth();

  return (
    <div className="h-16 bg-dark-200 border-b border-gray-800 flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-40">

      {/* Page Title */}
      <h2 className="text-white font-semibold text-lg">{title}</h2>

      {/* Right Side */}
      <div className="flex items-center gap-4">

        {/* Role Badge */}
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          user?.role === 'Admin'
            ? 'bg-wine-900 text-wine-300 border border-wine-700'
            : 'bg-gray-800 text-gray-300 border border-gray-700'
        }`}>
          {user?.role}
        </span>

        {/* User Avatar */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-wine-700 flex items-center justify-center text-white font-bold text-sm">
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>
          <span className="text-gray-300 text-sm">{user?.fullName}</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;