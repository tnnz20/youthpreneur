export interface NavLinkItem {
  label: string;
  to: string;
  download?: boolean | string;
  external?: boolean;
}

export interface SiteContextValue {
  openModal: (title: string, description?: string) => void;
}
