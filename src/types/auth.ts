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

export type UserRole = 'member' | 'admin';

export interface AuthUser {
  public_id: string;
  email: string;
  role: UserRole;
  profile: {
    full_name?: string;
  };
}
