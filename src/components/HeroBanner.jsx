import { Link } from 'react-router-dom'
import { FiArrowRight, FiTruck, FiClock, FiShield } from 'react-icons/fi'

export default function HeroBanner() {
  return (
    <section>
      {/* Main Banner */}
      <div className="bg-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-lg animate-fadeIn">
              <span className="inline-block bg-amber-400 text-amber-900 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                🎉 Free Delivery on ৳500+ orders
              </span>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                Fresh Groceries
                <br />
                <span className="text-amber-300">Delivered to Your Door</span>
              </h1>
              <p className="text-primary-200 text-base md:text-lg mb-6">
                আলম নগর সুপার শপ এ পাবেন ১০০০+ নিত্য প্রয়োজনীয় পণ্য। তাজা সবজি থেকে প্রিমিয়াম মাছ — আপনার রান্না ঘরের সব কিছু।
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-amber-400 text-amber-900 font-semibold px-6 py-3 rounded-full hover:bg-amber-300 transition-all"
              >
                Shop Now <FiArrowRight />
              </Link>
            </div>

            <div className="text-8xl md:text-[140px] leading-none animate-scaleIn">
              🛒
            </div>
          </div>
        </div>
      </div>

      {/* Features strip */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: FiTruck, title: 'Free Delivery', desc: 'On orders ৳500+', color: 'bg-green-50 text-green-600' },
              { icon: FiClock, title: 'Express Delivery', desc: 'Within 2 hours', color: 'bg-blue-50 text-blue-600' },
              { icon: FiShield, title: 'Fresh Guarantee', desc: '100% quality assured', color: 'bg-amber-50 text-amber-600' },
              { icon: FiPhone, title: 'Support 24/7', desc: 'Call us anytime', color: 'bg-purple-50 text-purple-600' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${f.color.split(' ')[0]}`}>
                  <f.icon size={20} className={f.color.split(' ')[1]} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{f.title}</p>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FiPhone(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  )
}
