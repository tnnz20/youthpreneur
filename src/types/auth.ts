export interface LoginRequest {
  email: string;
  password: string;
}

export type Gender = 'male' | 'female';

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  nik: string;
  birth_date: string;
  gender: Gender;
  district: string;
  phone: string;
  address: string;
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
