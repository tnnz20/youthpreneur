import type { LucideIcon } from 'lucide-react';

import type { NavLinkItem } from './site';

export interface FooterAction {
  label: string;
  modalTitle: string;
  modalDescription?: string;
}

export interface FooterColumn {
  title: string;
  links: NavLinkItem[];
  actions: FooterAction[];
}

export interface SocialLink {
  label: string;
  icon: LucideIcon;
}
