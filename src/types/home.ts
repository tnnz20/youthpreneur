import type { LucideIcon } from 'lucide-react';

export interface Category {
  name: string;
  subtitle: string;
  color: string;
  icon: LucideIcon;
}

export interface Metric {
  value: string;
  label: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export interface Course {
  title: string;
  mentor: string;
  image: string;
  fallback: string;
  rating: string;
  stars: number;
  reviews: string;
  slotAvailable: boolean;
  bestSeller?: boolean;
}

export interface Mentor {
  name: string;
  role: string;
  rating: string;
  mentees: string;
  image: string;
  fallback: string;
  rim: string;
}

export interface Testimonial {
  name: string;
  origin: string;
  quote: string;
  image: string;
  fallback: string;
}

export interface Article {
  title: string;
  modalTitle: string;
  date: string;
  readTime: string;
  image: string;
  fallback: string;
  url?: string;
}

export interface Official {
  name: string;
  role: string;
  institution?: string;
  image: string;
  accentColor: string;
  badgeVariant?: 'neoYellow' | 'neoMint';
}
