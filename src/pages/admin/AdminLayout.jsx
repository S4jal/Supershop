import { Link, Outlet, useLocation } from 'react-router-dom'
import { FiGrid, FiBox, FiTag, FiShoppingBag, FiLogOut, FiHome } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { path: '/admin', icon: FiGrid, label: 'Dashboard', exact: true },
  { path: '/admin/products', icon: FiBox, label: 'Products' },
  { path: '/admin/categories', icon: FiTag, label: 'Categories' },
  { path: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
]

export default function AdminLayout() {
  const { signOut, user } = useAuth()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="p-5 border-b">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h2 className="font-bold text-gray-800">SuperShop</h2>
              <p className="text-[10px] text-gray-400">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t space-y-1">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <FiHome size={18} /> View Store
          </Link>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition"
          >
            <FiLogOut size={18} /> Sign Out
          </button>
        </div>

        <div className="p-4 border-t">
          <p className="text-xs text-gray-400 truncate">{user?.email}</p>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex-1 flex flex-col">
        <header className="md:hidden bg-white border-b p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="font-bold text-gray-800">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            {navItems.map(item => {
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`p-2 rounded-lg ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-500'}`}
                >
                  <item.icon size={18} />
                </Link>
              )
            })}
            <button onClick={signOut} className="p-2 text-red-500">
              <FiLogOut size={18} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
