# Alam Nagar Super Shop

A modern, full-featured online grocery e-commerce web application built for **Alam Nagar Super Shop**. Customers can browse products, filter by category, search, add items to cart, and place orders — all from a beautiful, responsive interface.

## Live Demo

> Deployed on Netlify

---

## Features

### Customer Side
- **Home Page** — Hero banner, special offers, featured products, category highlights, and best sellers
- **Product Browsing** — 72+ products across 13 categories with search, filter, and sort functionality
- **Category Filtering** — Rice & Flour, Dal & Pulses, Oil & Ghee, Spices, Dairy, Fruits, Vegetables, Snacks, Beverages, Meat & Poultry, Fish & Seafood, Personal Care, Baby Care
- **Product Details** — Individual product pages with description, rating, price, and discount info
- **Shopping Cart** — Add/remove items, adjust quantities, view total with discount calculations
- **Checkout** — Complete order placement flow
- **Responsive Design** — Fully mobile-friendly, works great on all screen sizes

### Admin Panel
- **Dashboard** — Overview of store metrics
- **Product Management** — Add, edit, and manage products
- **Category Management** — Organize product categories
- **Order Management** — View and manage customer orders
- **Secure Login** — Admin authentication via Supabase

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | Frontend UI library |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Utility-first CSS framework |
| **React Router DOM** | Client-side routing |
| **Supabase** | Backend database & authentication |
| **Stripe** | Payment processing |
| **Framer Motion** | Smooth animations |
| **React Icons** | Icon library |
| **React Hot Toast** | Toast notifications |
| **Recharts** | Admin dashboard charts |

---

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── HeroBanner.jsx
│   ├── CategoryBar.jsx
│   ├── ProductCard.jsx
│   ├── ProductSection.jsx
│   └── ProtectedRoute.jsx
├── pages/              # Route pages
│   ├── Home.jsx
│   ├── Products.jsx
│   ├── ProductDetail.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   └── admin/
│       ├── AdminLayout.jsx
│       ├── AdminLogin.jsx
│       ├── Dashboard.jsx
│       ├── AdminProducts.jsx
│       ├── AdminCategories.jsx
│       └── AdminOrders.jsx
├── context/            # React Context providers
│   ├── AuthContext.jsx
│   └── CartContext.jsx
├── data/               # Static demo data
│   ├── products.js     # 72+ products with pricing
│   └── categories.js   # 13 product categories
├── hooks/              # Custom React hooks
│   ├── useProducts.js
│   └── useCategories.js
├── lib/
│   └── supabase.js     # Supabase client config
├── App.jsx             # Main app with routes
├── main.jsx            # Entry point
└── index.css           # Global styles + Tailwind
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/Supershop.git
cd Supershop

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase and Stripe keys

# Start development server
npm run dev
```

The app will be running at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Build output will be in the `dist/` folder.

---

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Deployment (Netlify)

This project is configured for Netlify deployment:

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy!

The `netlify.toml` and `public/_redirects` files handle SPA routing automatically.

---

## Payment Methods Supported

- bKash
- Nagad
- Visa/Mastercard
- Cash on Delivery (COD)

---

## Contact

- **Location:** Alam Nagar, Bangladesh
- **Email:** support@alamnagarsupershop.com

---

## License

This project is private and proprietary.
