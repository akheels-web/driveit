-- ═══════════════════════════════════════════════════════════════
-- DRIVEIT Luxury — Database Schema
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ═══════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────
-- Cars Table
-- ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('sedan', 'suv', 'sports', 'mpv', 'bus', 'wedding', 'convertible')),
  brand TEXT NOT NULL,
  price_per_day NUMERIC NOT NULL DEFAULT 0,
  price_display TEXT DEFAULT 'Contact for pricing',
  is_available BOOLEAN DEFAULT true,
  service_types TEXT[] DEFAULT '{"chauffeur","selfdrive","airport"}',
  features TEXT[] DEFAULT '{}',
  seats INTEGER DEFAULT 4,
  transmission TEXT DEFAULT 'Automatic',
  fuel_type TEXT DEFAULT 'Diesel',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ──────────────────────────────────────────────────
-- Bookings Table
-- ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_ref TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id),
  car_id UUID REFERENCES cars(id),
  car_name TEXT NOT NULL,
  service_type TEXT NOT NULL,
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT,
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  duration_days INTEGER DEFAULT 1,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'refunded')),
  payment_method TEXT,
  upi_transaction_id TEXT,
  total_amount NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ──────────────────────────────────────────────────
-- Customer Profiles (extends auth.users)
-- ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ──────────────────────────────────────────────────
-- Row Level Security
-- ──────────────────────────────────────────────────

-- Cars: anyone can read
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cars are viewable by everyone" ON cars FOR SELECT USING (true);

-- Bookings: users see own, anon can create
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can create bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anonymous can create bookings" ON bookings
  FOR INSERT WITH CHECK (user_id IS NULL);
CREATE POLICY "Users can update own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = user_id);

-- Profiles: users manage own
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ──────────────────────────────────────────────────
-- Auto-create profile on user signup
-- ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ──────────────────────────────────────────────────
-- Auto-update updated_at timestamp
-- ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ──────────────────────────────────────────────────
-- Seed Cars Data (from existing fleet)
-- ──────────────────────────────────────────────────
INSERT INTO cars (name, image_url, category, brand, price_per_day, price_display, service_types, seats, transmission, fuel_type, sort_order) VALUES
  -- Luxury Sedans
  ('BMW 520D', '/sadan/1.jpg', 'sedan', 'BMW', 8000, '₹8,000/day', '{"chauffeur","selfdrive"}', 5, 'Automatic', 'Diesel', 1),
  ('Lamborghini Gallardo', '/sadan/2.jpg', 'sports', 'Lamborghini', 75000, '₹75,000/day', '{"selfdrive"}', 2, 'Automatic', 'Petrol', 2),
  ('Lexus ES 300H', '/sadan/3.jpg', 'sedan', 'Lexus', 9000, '₹9,000/day', '{"chauffeur","airport"}', 5, 'Automatic', 'Hybrid', 3),
  ('Mercedes S 350', '/sadan/4.jpg', 'sedan', 'Mercedes', 15000, '₹15,000/day', '{"chauffeur","airport"}', 5, 'Automatic', 'Diesel', 4),
  ('Mercedes S 450', '/sadan/5.jpg', 'sedan', 'Mercedes', 18000, '₹18,000/day', '{"chauffeur","airport"}', 5, 'Automatic', 'Petrol', 5),
  ('Toyota Camry', '/sadan/6.jpg', 'sedan', 'Toyota', 6000, '₹6,000/day', '{"chauffeur","airport","selfdrive"}', 5, 'Automatic', 'Hybrid', 6),
  ('Volvo S60 D5', '/sadan/7.jpg', 'sedan', 'Volvo', 7000, '₹7,000/day', '{"chauffeur","selfdrive"}', 5, 'Automatic', 'Diesel', 7),
  ('Audi A6', '/sadan/8.jpg', 'sedan', 'Audi', 10000, '₹10,000/day', '{"chauffeur","airport","selfdrive"}', 5, 'Automatic', 'Diesel', 8),
  ('Audi RS5 Quattro', '/sadan/9.jpg', 'sports', 'Audi', 25000, '₹25,000/day', '{"selfdrive"}', 4, 'Automatic', 'Petrol', 9),

  -- Premium SUVs & MPVs
  ('KIA Carnival', '/suv/1.jpg', 'mpv', 'KIA', 7000, '₹7,000/day', '{"chauffeur","airport"}', 7, 'Automatic', 'Diesel', 10),
  ('Mercedes GLS 350D', '/suv/2.jpg', 'suv', 'Mercedes', 20000, '₹20,000/day', '{"chauffeur","airport","selfdrive"}', 7, 'Automatic', 'Diesel', 11),
  ('Mini Cooper Countryman', '/suv/3.jpg', 'suv', 'Mini', 12000, '₹12,000/day', '{"selfdrive"}', 5, 'Automatic', 'Petrol', 12),
  ('Toyota Commuter Custom', '/suv/4.jpg', 'bus', 'Toyota', 8000, '₹8,000/day', '{"chauffeur","airport"}', 14, 'Manual', 'Diesel', 13),
  ('Toyota Crysta MT', '/suv/5.jpg', 'mpv', 'Toyota', 5000, '₹5,000/day', '{"chauffeur","airport","selfdrive"}', 7, 'Manual', 'Diesel', 14),
  ('Toyota Fortuner', '/suv/6.jpg', 'suv', 'Toyota', 6500, '₹6,500/day', '{"chauffeur","airport","selfdrive"}', 7, 'Automatic', 'Diesel', 15),
  ('Toyota Vellfire', '/suv/7.jpg', 'mpv', 'Toyota', 15000, '₹15,000/day', '{"chauffeur","airport"}', 7, 'Automatic', 'Hybrid', 16),
  ('Volvo XC60', '/suv/8.jpg', 'suv', 'Volvo', 9000, '₹9,000/day', '{"chauffeur","selfdrive"}', 5, 'Automatic', 'Diesel', 17),
  ('Audi Q7 Quattro', '/suv/9.jpg', 'suv', 'Audi', 14000, '₹14,000/day', '{"chauffeur","airport","selfdrive"}', 7, 'Automatic', 'Diesel', 18),

  -- Trending & Special Collection
  ('Mercedes G 350 Wagon', '/trending/1.jpg', 'suv', 'Mercedes', 35000, '₹35,000/day', '{"selfdrive","chauffeur"}', 5, 'Automatic', 'Diesel', 19),
  ('Mercedes GLS 400D', '/trending/2.jpg', 'suv', 'Mercedes', 22000, '₹22,000/day', '{"chauffeur","airport","selfdrive"}', 7, 'Automatic', 'Diesel', 20),
  ('Mercedes V-Class', '/trending/3.jpg', 'mpv', 'Mercedes', 18000, '₹18,000/day', '{"chauffeur","airport"}', 7, 'Automatic', 'Diesel', 21),
  ('Range Rover Vogue', '/trending/4.jpg', 'suv', 'Land Rover', 30000, '₹30,000/day', '{"chauffeur","selfdrive"}', 5, 'Automatic', 'Diesel', 22),
  ('Volvo S90', '/trending/5.jpg', 'sedan', 'Volvo', 10000, '₹10,000/day', '{"chauffeur","selfdrive"}', 5, 'Automatic', 'Diesel', 23),
  ('Volvo XC 90', '/trending/6.jpg', 'suv', 'Volvo', 12000, '₹12,000/day', '{"chauffeur","selfdrive"}', 7, 'Automatic', 'Diesel', 24),
  ('BMW 730 LD', '/trending/7.jpg', 'sedan', 'BMW', 15000, '₹15,000/day', '{"chauffeur","airport"}', 5, 'Automatic', 'Diesel', 25),
  ('BMW i4', '/trending/8.jpg', 'sedan', 'BMW', 12000, '₹12,000/day', '{"selfdrive"}', 5, 'Automatic', 'Electric', 26),
  ('Mercedes C300 Convertible', '/trending/9.jpg', 'convertible', 'Mercedes', 20000, '₹20,000/day', '{"selfdrive"}', 4, 'Automatic', 'Petrol', 27),
  ('Mercedes E 220D', '/trending/10.jpg', 'sedan', 'Mercedes', 10000, '₹10,000/day', '{"chauffeur","airport","selfdrive"}', 5, 'Automatic', 'Diesel', 28);
