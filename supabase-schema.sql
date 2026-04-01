-- =============================================
-- SuperShop Database Schema for Supabase
-- Run this in Supabase SQL Editor
-- =============================================

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT DEFAULT '📦',
  color TEXT DEFAULT '#16a34a',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'kg',
  image_url TEXT,
  emoji TEXT DEFAULT '📦',
  discount INT DEFAULT 0 CHECK (discount >= 0 AND discount <= 100),
  stock INT DEFAULT 0,
  rating NUMERIC(2,1) DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_area TEXT NOT NULL,
  delivery_note TEXT,
  payment_method TEXT NOT NULL DEFAULT 'cod',
  payment_details JSONB,
  coupon_code TEXT,
  discount NUMERIC(10,2) NOT NULL DEFAULT 0,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  delivery_charge NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'delivered', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Order items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  price NUMERIC(10,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  total NUMERIC(10,2) NOT NULL
);

-- Customer profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  phone TEXT,
  email TEXT,
  default_road TEXT,
  default_house TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Coupons table
CREATE TABLE coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10,2) NOT NULL DEFAULT 0,
  min_order NUMERIC(10,2) DEFAULT 0,
  max_discount NUMERIC(10,2),
  usage_limit INT,
  used_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read coupons" ON coupons FOR SELECT USING (true);
CREATE POLICY "Auth manage coupons" ON coupons FOR ALL USING (auth.role() = 'authenticated');

-- Payment methods table
CREATE TABLE payment_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  key TEXT NOT NULL UNIQUE,
  icon TEXT DEFAULT '💳',
  description TEXT,
  account_info TEXT,
  fields JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Public read access for payment methods
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read payment_methods" ON payment_methods FOR SELECT USING (true);
CREATE POLICY "Auth manage payment_methods" ON payment_methods FOR ALL USING (auth.role() = 'authenticated');

-- Seed default payment methods
INSERT INTO payment_methods (name, key, icon, description, account_info, fields, is_active, sort_order) VALUES
  ('Cash on Delivery', 'cod', '💵', 'Pay when you receive', NULL, '[]', true, 1),
  ('bKash', 'bkash', '📱', 'Mobile payment', 'bKash: 01XXXXXXXXX (Personal)', '[{"name":"bkash_phone","label":"bKash Number","type":"tel","placeholder":"01XXXXXXXXX","required":true},{"name":"bkash_txid","label":"Transaction ID (TxID)","type":"text","placeholder":"Enter TxID after payment","required":true}]', false, 2),
  ('Nagad', 'nagad', '📲', 'Mobile payment', 'Nagad: 01XXXXXXXXX', '[{"name":"nagad_phone","label":"Nagad Number","type":"tel","placeholder":"01XXXXXXXXX","required":true},{"name":"nagad_txid","label":"Transaction ID (TxID)","type":"text","placeholder":"Enter TxID after payment","required":true}]', false, 3),
  ('Card Payment', 'card', '💳', 'Visa/Mastercard', NULL, '[{"name":"card_number","label":"Card Number","type":"text","placeholder":"XXXX XXXX XXXX XXXX","required":true},{"name":"card_expiry","label":"Expiry Date","type":"text","placeholder":"MM/YY","required":true},{"name":"card_cvv","label":"CVV","type":"text","placeholder":"XXX","required":true}]', false, 4);

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies (skip if already exist)
DO $$ BEGIN
  CREATE POLICY "Public product images" ON storage.objects FOR SELECT USING (bucket_id = 'products');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Auth users manage product images" ON storage.objects FOR ALL USING (bucket_id = 'products' AND auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public read access for categories and products
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);

-- Auth users can manage everything
CREATE POLICY "Auth manage categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth manage products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth manage orders" ON orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth manage order_items" ON order_items FOR ALL USING (auth.role() = 'authenticated');

-- Public can create orders (placing orders)
CREATE POLICY "Public create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public create order_items" ON order_items FOR INSERT WITH CHECK (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed default categories
INSERT INTO categories (name, slug, icon, color, sort_order) VALUES
  ('Rice & Flour', 'rice', '🍚', '#f59e0b', 1),
  ('Dal & Pulses', 'dal', '🫘', '#d97706', 2),
  ('Oil & Ghee', 'oil', '🫗', '#eab308', 3),
  ('Spices', 'spices', '🌶️', '#ef4444', 4),
  ('Dairy', 'dairy', '🥛', '#3b82f6', 5),
  ('Fruits', 'fruits', '🍎', '#22c55e', 6),
  ('Vegetables', 'vegetables', '🥬', '#65a30d', 7),
  ('Snacks', 'snacks', '🍪', '#f97316', 8),
  ('Beverages', 'beverages', '🥤', '#0ea5e9', 9),
  ('Meat & Poultry', 'meat', '🍗', '#dc2626', 10),
  ('Fish & Seafood', 'fish', '🐟', '#0284c7', 11),
  ('Personal Care', 'personal', '🧴', '#8b5cf6', 12),
  ('Baby Care', 'baby', '👶', '#ec4899', 13);
