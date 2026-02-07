import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { ShoppingCart, User, LogOut, Menu } from 'lucide-react';

const Navbar = () => {
  const { user, signOut } = useAuthStore();
  const { cart } = useCartStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-purple-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/images/logo.png" alt="Logo" className="h-10 w-10 object-cover rounded-full" />
            <span className="font-bold text-lg sm:text-xl">Nature Embroidery</span>
          </Link>

          {/* Hamburger Menu Button (Mobile) */}
          <button className="sm:hidden" onClick={() => setIsOpen(!isOpen)}>
            <Menu size={24} />
          </button>

          {/* Navigation Links (Desktop) */}
          <div className="hidden sm:flex items-center space-x-4">
            <Link to="/designs" className="hover:text-gray-200">Designs</Link>
            <Link to="/contact" className="hover:text-gray-200">Contact</Link>

            <Link to="/cart" className="relative">
              <ShoppingCart size={24} className="hover:text-gray-300" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>

            {user ? (
  <>
    <Link to="/orders" className="hover:text-gray-200">
      My Orders
    </Link>

    <Link to="/profile" className="flex items-center hover:opacity-90" title="Profile">
      {user.profile_picture ? (
        <img
          src={user.profile_picture}
          alt="Profile"
          className="h-8 w-8 rounded-full object-cover border-2 border-white/50"
        />
      ) : (
        <User size={20} />
      )}
    </Link>

    <button
      onClick={handleSignOut}
      className="hover:text-gray-200"
      title="Logout"
    >
      <LogOut size={20} />
    </button>
  </>
) : (
  <>
    <Link to="/login" className="hover:text-gray-200">
      Login
    </Link>

    <Link
      to="/signup"
      className="bg-white text-purple-700 px-4 py-1 rounded hover:bg-gray-100"
    >
      Sign Up
    </Link>
  </>
)}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="sm:hidden bg-purple-800 py-4">
          <Link to="/designs" className="block py-2 px-4">Designs</Link>
          <Link to="/contact" className="block py-2 px-4">Contact</Link>
          <Link to="/cart" className="block py-2 px-4">Cart ({cart.length})</Link>
          {user ? (
            <>
              <Link to="/orders" className="block py-2 px-4">My Orders</Link>
              <Link to="/profile" className="flex items-center gap-2 py-2 px-4">
                {user.profile_picture ? (
                  <img src={user.profile_picture} alt="" className="h-8 w-8 rounded-full object-cover border border-white/50" />
                ) : null}
                Profile
              </Link>
              <button onClick={handleSignOut} className="block py-2 px-4">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2 px-4">Login</Link>
              <Link to="/signup" className="block py-2 px-4">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;



