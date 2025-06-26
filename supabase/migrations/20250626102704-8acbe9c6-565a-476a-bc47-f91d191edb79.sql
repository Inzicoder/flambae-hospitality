
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  user_type TEXT CHECK (user_type IN ('guest', 'eventCompany')) DEFAULT 'guest',
  company_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create weddings table
CREATE TABLE public.weddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_names TEXT NOT NULL,
  wedding_date DATE,
  venue TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create budget categories table
CREATE TABLE public.budget_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  estimated_amount DECIMAL(10,2) DEFAULT 0,
  actual_amount DECIMAL(10,2) DEFAULT 0,
  status TEXT CHECK (status IN ('pending', 'partial', 'paid')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create guests table
CREATE TABLE public.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone_number TEXT,
  attendance_status TEXT CHECK (attendance_status IN ('confirmed', 'declined', 'pending')) DEFAULT 'pending',
  plus_one BOOLEAN DEFAULT FALSE,
  dietary_restrictions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create todos table
CREATE TABLE public.todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  urgent BOOLEAN DEFAULT FALSE,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vendors table
CREATE TABLE public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  cost DECIMAL(10,2),
  status TEXT CHECK (status IN ('contacted', 'booked', 'paid')) DEFAULT 'contacted',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notes table
CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gallery table for photos
CREATE TABLE public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  category TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for weddings
CREATE POLICY "Users can manage own weddings" ON public.weddings
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for budget categories
CREATE POLICY "Users can manage wedding budget" ON public.budget_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.weddings 
      WHERE weddings.id = budget_categories.wedding_id 
      AND weddings.user_id = auth.uid()
    )
  );

-- Create RLS policies for guests
CREATE POLICY "Users can manage wedding guests" ON public.guests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.weddings 
      WHERE weddings.id = guests.wedding_id 
      AND weddings.user_id = auth.uid()
    )
  );

-- Create RLS policies for todos
CREATE POLICY "Users can manage wedding todos" ON public.todos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.weddings 
      WHERE weddings.id = todos.wedding_id 
      AND weddings.user_id = auth.uid()
    )
  );

-- Create RLS policies for vendors
CREATE POLICY "Users can manage wedding vendors" ON public.vendors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.weddings 
      WHERE weddings.id = vendors.wedding_id 
      AND weddings.user_id = auth.uid()
    )
  );

-- Create RLS policies for notes
CREATE POLICY "Users can manage wedding notes" ON public.notes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.weddings 
      WHERE weddings.id = notes.wedding_id 
      AND weddings.user_id = auth.uid()
    )
  );

-- Create RLS policies for gallery
CREATE POLICY "Users can manage wedding gallery" ON public.gallery
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.weddings 
      WHERE weddings.id = gallery.wedding_id 
      AND weddings.user_id = auth.uid()
    )
  );

-- Create trigger to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create storage bucket for photo uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('wedding-photos', 'wedding-photos', true);

-- Create storage policy for wedding photos
CREATE POLICY "Users can upload wedding photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'wedding-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view wedding photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'wedding-photos');

CREATE POLICY "Users can update own wedding photos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'wedding-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own wedding photos" ON storage.objects
  FOR DELETE USING (bucket_id = 'wedding-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
