export type TrainingCategory =
  | 'Wirausaha & Agribisnis'
  | 'Kriya & Kreativitas'
  | 'Digital & IPTEK'
  | 'Olahraga & Prestasi'
  | 'Komunitas & Pemuda';

export type TrainingStatus = 'planned' | 'ongoing' | 'completed';

export type EnrollmentStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

export interface TrainingCatalog {
  public_id: string;
  title: string | null;
  description: string | null;
  pic_phone: string | null;
  category: TrainingCategory | null;
  max_slots: number | null;
  registered_count: number;
  training_status: TrainingStatus | null;
  link: string | null;
  address: string | null;
  thumbnail: string | null;
  start_date: string | null;
  end_date: string | null;
  mentor: string | null;
  created_at: number;
  updated_at: number;
}

export interface CreateTrainingCatalogInput {
  title?: string | null;
  description?: string | null;
  pic_phone?: string | null;
  category?: TrainingCategory | null;
  max_slots?: number | null;
  training_status?: TrainingStatus | null;
  link?: string | null;
  address?: string | null;
  thumbnail?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  mentor?: string | null;
}

export type UpdateTrainingCatalogInput = Partial<CreateTrainingCatalogInput>;

export interface UpdateTrainingCatalogStatusInput {
  training_status: TrainingStatus;
}

export interface UploadThumbnailResponse {
  thumbnail_url: string;
}

export interface TrainingCatalogListParams {
  cursor?: string;
  limit?: number;
  search?: string;
  q?: string;
  title?: string;
  mentor?: string;
  category?: TrainingCategory | string;
  training_status?: TrainingStatus | string;
  start_date?: string;
  order?: 'asc' | 'desc';
}

export interface TrainingCatalogListResponse {
  training_catalogs: TrainingCatalog[];
  next_cursor?: string | null;
}

export interface EnrollmentCatalogSummary {
  public_id: string;
  title?: string | null;
  name?: string | null;
  category?: TrainingCategory | null;
  max_slots?: number | null;
  registered_count?: number;
  training_status?: TrainingStatus | null;
}

export interface TrainingEnrollment {
  public_id: string;
  user_public_id: string;
  full_name?: string | null;
  register_date: string;
  status: EnrollmentStatus;
  created_at: number;
  updated_at: number;
  deleted_at?: number | null;
  catalog?: EnrollmentCatalogSummary | null;
}

export interface EnrollTrainingInput {
  catalog_public_id: string;
}

export interface UpdateEnrollmentStatusInput {
  status: EnrollmentStatus;
}

export interface EnrollmentListParams {
  cursor?: string;
  limit?: number;
  status?: EnrollmentStatus | string;
  search?: string;
}

export interface EnrollmentListResponse {
  training_enrollments: TrainingEnrollment[];
  next_cursor?: string | null;
}
