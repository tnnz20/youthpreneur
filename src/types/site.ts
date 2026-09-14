export interface NavLinkItem {
  label: string;
  to: string;
}

export interface SiteContextValue {
  openModal: (title: string, description?: string) => void;
}
