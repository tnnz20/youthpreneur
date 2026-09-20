export type UserGender = 'male' | 'female';

export interface UserProfile {
  full_name: string;
  nik: string | null;
  birth_date: string | null;
  gender: UserGender | null;
  district: string | null;
  phone: string | null;
  address: string | null;
}

export interface User {
  public_id: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: number;
  updated_at: number;
  profile: UserProfile | null;
}

export interface UserListResponse {
  users: User[];
  next_cursor?: string;
}

export interface UserListParams {
  cursor?: string;
  limit?: number;
  district?: string;
  gender?: UserGender;
  search?: string;
}
