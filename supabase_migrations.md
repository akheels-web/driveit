# Supabase Database Migrations

Please run the following SQL commands in your Supabase SQL Editor to initialize the tables needed for the Phase 2 Growth Features: Wishlists, Saved Addresses, and Loyalty Points.

```sql
-- 1. Create PROFILES Table
-- This will store extended user information like loyalty points, tiers, and saved addresses.
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  loyalty_points INTEGER DEFAULT 0,
  loyalty_tier TEXT DEFAULT 'Silver', -- Silver, Gold, Platinum, Black
  home_address TEXT,
  office_address TEXT,
  airport_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trigger to automatically create a profile for every new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. Create WISHLISTS Table
-- This stores favorited cars for logged-in users.
CREATE TABLE wishlists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  car_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, car_id)
);

-- Turn on Row Level Security for wishlists
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Wishlist Policies
CREATE POLICY "Users can view their own wishlists." ON wishlists
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own wishlists." ON wishlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own wishlists." ON wishlists
  FOR DELETE USING (auth.uid() = user_id);
```

> [!TIP]
> **What this does:**
> 1. It creates a `profiles` table to track points, tiers, and saved addresses.
> 2. It sets up an automatic trigger to create a profile row whenever a new user signs up in Supabase Auth.
> 3. It creates a `wishlists` table securely scoped to the logged-in user.
