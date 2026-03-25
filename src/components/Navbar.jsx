import { useAuth } from '../context/AuthContext';

const Navbar = ({ title, onMenuClick }) => {
  const { user } = useAuth();

  return (
    <div className="h-16 bg-dark-200 border-b border-gray-800 flex items-center justify-between px-4 md:px-6 fixed top-0 right-0 left-0 lg:left-64 z-40">

      {/* Left Side */}
      <div className="flex items-center gap-3">
        {/* Hamburger - mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-400 hover:text-white p-1 text-2xl leading-none"
        >
          ☰
        </button>
        <h2 className="text-white font-semibold text-base md:text-lg">{title}</h2>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 md:gap-4">

        {/* Role Badge - hidden on very small screens */}
        <span className={`hidden sm:inline-block px-3 py-1 rounded-full text-xs font-medium ${
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
          <span className="hidden sm:block text-gray-300 text-sm">{user?.fullName}</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;