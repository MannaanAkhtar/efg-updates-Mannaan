import { createBrowserClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Create browser client for client components
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mxnysxhgyxzjkzxwjlkc.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14bnlzeGhneXh6amt6eHdqbGtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3ODE4OTgsImV4cCI6MjA4NzM1Nzg5OH0.y9FFJfHlWqSDL0MXkXImtcztVhjV3TbeyAXqAXhTM7A'
  )
}

// Legacy export for backwards compatibility (insights page etc.)
export const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mxnysxhgyxzjkzxwjlkc.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14bnlzeGhneXh6amt6eHdqbGtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3ODE4OTgsImV4cCI6MjA4NzM1Nzg5OH0.y9FFJfHlWqSDL0MXkXImtcztVhjV3TbeyAXqAXhTM7A'
)

// ═══════════════════════════════════════════════════════════════
// TYPES - Networking Matchmaker
// ═══════════════════════════════════════════════════════════════

export type Profile = {
  id: string
  user_id: string
  email: string
  full_name: string
  title: string
  company: string
  industry_id: string | null
  role_type: string
  company_size: string
  phone?: string
  linkedin_url?: string
  photo_url?: string
  bio?: string
  interests: string[]
  looking_for: string[]
  open_to_sponsors: boolean
  is_verified: boolean
  is_admin: boolean
  profile_completed: boolean
  visibility: string
  created_at: string
  updated_at: string
}

export type Event = {
  id: string
  name: string
  slug: string
  date: string
  location: string
  venue: string
  description?: string
  is_active: boolean
  created_at: string
}

export type EventRegistration = {
  id: string
  event_id: string
  profile_id: string
  registered_at: string
  status: 'registered' | 'confirmed' | 'attended' | 'cancelled'
}

// ═══════════════════════════════════════════════════════════════
// TYPES - Insights/Blog (existing)
// ═══════════════════════════════════════════════════════════════

export type Author = {
  id: string
  name: string
  role: string
  title?: string
  company?: string
  organization?: string
  photo_url?: string
  avatar_url?: string
  bio?: string
  linkedin_url?: string
  twitter_url?: string
}

export type Post = {
  id: string
  title: string
  subtitle?: string
  slug: string
  excerpt: string
  content: string
  featured_image_url?: string
  cover_image_url?: string
  category: string
  content_type: string
  author_id: string
  published_at: string
  read_time_minutes: number
  reading_time_minutes?: number
  is_featured: boolean
  is_published: boolean
  tags?: string[]
  meta_title?: string
  meta_description?: string
  views?: number
  event_tag?: string
  event_url?: string
  event_date?: string
  series?: string
  created_at: string
  updated_at: string
}

export type PostWithAuthor = Post & {
  author: Author
  authors?: Author
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

export const INDUSTRIES = [
  'Banking & Finance',
  'Oil & Gas',
  'Telecommunications',
  'Government',
  'Healthcare',
  'Retail & E-commerce',
  'Manufacturing',
  'Technology',
  'Education',
  'Real Estate',
  'Transportation & Logistics',
  'Other'
]

export const ROLE_TYPES = [
  'C-Level (CEO, CTO, CISO, CIO)',
  'VP / SVP',
  'Director',
  'Manager',
  'Individual Contributor',
  'Consultant',
  'Vendor / Solution Provider',
  'Other'
]

export const COMPANY_SIZES = [
  '1-50 employees',
  '51-200 employees',
  '201-500 employees',
  '501-1000 employees',
  '1001-5000 employees',
  '5000+ employees'
]

export const INTERESTS = [
  'Zero Trust Architecture',
  'Cloud Security',
  'AI & Machine Learning',
  'Data Privacy',
  'Incident Response',
  'Threat Intelligence',
  'Identity & Access Management',
  'OT/ICS Security',
  'Application Security',
  'Security Operations',
  'Risk Management',
  'Compliance & Governance',
  'Digital Transformation',
  'Operational Excellence'
]

export const LOOKING_FOR = [
  'Meet peers in my industry',
  'Find technology solutions',
  'Explore partnerships',
  'Learn best practices',
  'Network with vendors',
  'Recruit talent',
  'Share knowledge / Speak'
]
