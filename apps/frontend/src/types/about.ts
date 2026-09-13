import type { LucideIcon } from 'lucide-react';

export interface ProfileRole {
  icon: LucideIcon;
  title: string;
  description: string;
  tag: string;
  tagColor: string;
  iconBg: string;
}

export interface DatasetRow {
  label: string;
  status: string;
  color: string;
}

export interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  wide?: boolean;
}

export interface Stakeholder {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  wide?: boolean;
}
