export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  district?: string;
  phone?: string;
}

export interface AuthUser {
  public_id: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: number;
  updated_at: number;
  profile: {
    full_name?: string;
    district?: string;
    phone?: string;
  };
}
