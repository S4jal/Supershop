import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiShoppingCart, FiSearch, FiMenu, FiX, FiMapPin, FiPhone, FiUser } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { cartCount } = useCart()
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`)
      setSearch('')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-primary-700 text-white text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><FiPhone size={12} /> 01XXXXXXXXX</span>
            <span className="hidden sm:flex items-center gap-1"><FiMapPin size={12} /> Alam Nagar, Bangladesh</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Free delivery on orders over ৳500</span>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-800 leading-tight">Alam Nagar Super Shop</h1>
              <p className="text-[10px] text-gray-500 -mt-0.5">Fresh Grocery Delivered</p>
            </div>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex">
            <div className="relative w-full">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for rice, fish, vegetables..."
                className="w-full pl-4 pr-12 py-2.5 border-2 border-primary-200 rounded-full focus:border-primary-500 focus:outline-none text-sm"
              />
              <button type="submit" className="absolute right-1 top-1 bottom-1 px-4 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition">
                <FiSearch size={18} />
              </button>
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <Link to={user ? '/profile' : '/account'} className="p-2 hover:bg-gray-100 rounded-full transition hidden sm:flex">
              {user ? (
                <div className="w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{user.email?.[0]?.toUpperCase()}</span>
                </div>
              ) : (
                <FiUser size={22} className="text-gray-700" />
              )}
            </Link>
            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition">
              <FiShoppingCart size={24} className="text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-full">
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="md:hidden mt-3">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-4 pr-12 py-2.5 border-2 border-primary-200 rounded-full focus:border-primary-500 focus:outline-none text-sm"
            />
            <button type="submit" className="absolute right-1 top-1 bottom-1 px-4 bg-primary-600 text-white rounded-full">
              <FiSearch size={18} />
            </button>
          </div>
        </form>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="md:hidden mt-3 pb-2 border-t pt-3">
            <div className="flex flex-col gap-2">
              <Link to="/" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-gray-700 hover:bg-primary-50 rounded-lg">Home</Link>
              <Link to="/products" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-gray-700 hover:bg-primary-50 rounded-lg">All Products</Link>
              <Link to="/track" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-gray-700 hover:bg-primary-50 rounded-lg">Track Order</Link>
              <Link to="/cart" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-gray-700 hover:bg-primary-50 rounded-lg">Cart ({cartCount})</Link>
              <Link to={user ? '/profile' : '/account'} onClick={() => setMenuOpen(false)} className="px-3 py-2 text-gray-700 hover:bg-primary-50 rounded-lg">
                {user ? 'My Account' : 'Sign In / Sign Up'}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
