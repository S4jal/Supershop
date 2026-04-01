import { Link } from 'react-router-dom'
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">SuperShop</h3>
                <p className="text-xs text-gray-500">Fresh Grocery Delivered</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Your trusted online grocery store in Bangladesh. Fresh products delivered to your doorstep.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition"><FiFacebook size={16} /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition"><FiInstagram size={16} /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition"><FiTwitter size={16} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary-400 transition">Home</Link></li>
              <li><Link to="/products" className="hover:text-primary-400 transition">All Products</Link></li>
              <li><Link to="/products?category=fruits" className="hover:text-primary-400 transition">Fresh Fruits</Link></li>
              <li><Link to="/products?category=vegetables" className="hover:text-primary-400 transition">Vegetables</Link></li>
              <li><Link to="/products?category=fish" className="hover:text-primary-400 transition">Fish & Seafood</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-400 transition">About Us</a></li>
              <li><a href="#" className="hover:text-primary-400 transition">Delivery Info</a></li>
              <li><a href="#" className="hover:text-primary-400 transition">Return Policy</a></li>
              <li><a href="#" className="hover:text-primary-400 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-400 transition">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><FiMapPin size={16} className="text-primary-400 shrink-0" /> Gulshan-2, Dhaka-1212, Bangladesh</li>
              <li className="flex items-center gap-2"><FiPhone size={16} className="text-primary-400 shrink-0" /> +880 16789</li>
              <li className="flex items-center gap-2"><FiMail size={16} className="text-primary-400 shrink-0" /> support@supershop.com.bd</li>
            </ul>
            <div className="mt-4 p-3 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400">Delivery Hours</p>
              <p className="text-sm text-white font-medium">8:00 AM - 10:00 PM</p>
              <p className="text-xs text-gray-400">7 days a week</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">© 2026 SuperShop. All rights reserved.</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>We accept:</span>
            <span className="bg-gray-800 px-2 py-1 rounded">bKash</span>
            <span className="bg-gray-800 px-2 py-1 rounded">Nagad</span>
            <span className="bg-gray-800 px-2 py-1 rounded">Visa</span>
            <span className="bg-gray-800 px-2 py-1 rounded">COD</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
