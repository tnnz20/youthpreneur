export type BusinessSector =
  | 'Kuliner'
  | 'Perdagangan Ritel'
  | 'Agribisnis & Ketahanan Pangan'
  | 'Jasa & Layanan Publik'
  | 'Fashion & Konveksi'
  | 'E-Commerce & Ekonomi Kreatif';

export type EnterpriseStatus = 'active' | 'inactive';
export type LegalStatus = 'complete' | 'in_progress' | 'none';
export type BusinessDigitization = 'high' | 'medium' | 'low';

export type InterventionNeeds =
  | 'Pelatihan'
  | 'Mentoring'
  | 'Digitalisasi'
  | 'Legalitas'
  | 'Permodalan'
  | 'Kemitraan'
  | 'Pemasaran';

export type ProcessStatus = 'completed' | 'ongoing' | 'planned';
export type GeneralStatus = 'yes' | 'no' | 'in_progress';

export interface Enterprise {
  public_id: string;
  user_public_id: string;
  full_name: string | null;
  enterprise_name: string;
  name?: string | null;
  business_sector: BusinessSector;
  description: string | null;
  address: string | null;
  focus_commodity: string | null;
  dispora_support: string | null;
  legal_status: LegalStatus | null;
  business_digitization: BusinessDigitization | null;
  intervention_needs: InterventionNeeds | null;
  training_status: ProcessStatus | null;
  mentoring_status: ProcessStatus | null;
  capital_access: GeneralStatus | null;
  partnership: GeneralStatus | null;
  initial_turnover: string;
  current_turnover: string;
  district: string | null;
  status: EnterpriseStatus;
  created_at: number;
  updated_at: number;
}

export interface PublicEnterprise {
  public_id: string;
  enterprise_name: string;
  full_name: string | null;
  business_sector: BusinessSector;
  district: string | null;
  description: string | null;
  focus_commodity: string | null;
  dispora_support: string | null;
  intervention_needs: InterventionNeeds | null;
  created_at: number;
}

export interface PublicEnterpriseListResponse {
  enterprises: PublicEnterprise[];
  next_cursor?: string;
}

export interface PublicEnterpriseListParams {
  cursor?: string;
  limit?: number;
  search?: string;
  district?: string;
  intervention_needs?: InterventionNeeds | string;
  business_sector?: BusinessSector | string;
}

export interface EnterpriseListResponse {
  enterprises: Enterprise[];
  next_cursor?: string;
}

export interface EnterpriseListParams {
  cursor?: string;
  limit?: number;
  search?: string;
  district?: string;
  status?: EnterpriseStatus;
  business_sector?: BusinessSector | string;
  legal_status?: LegalStatus;
  business_digitization?: BusinessDigitization;
  intervention_needs?: InterventionNeeds | string;
  training_status?: ProcessStatus;
  mentoring_status?: ProcessStatus;
  capital_access?: GeneralStatus;
  partnership?: GeneralStatus;
}

export interface CreateEnterpriseInput {
  enterprise_name: string;
  name?: string | null;
  business_sector: BusinessSector;
  description?: string | null;
  address?: string | null;
  focus_commodity?: string | null;
  legal_status?: LegalStatus | null;
  business_digitization?: BusinessDigitization | null;
  intervention_needs?: InterventionNeeds | null;
  training_status?: ProcessStatus | null;
  mentoring_status?: ProcessStatus | null;
  capital_access?: GeneralStatus | null;
  partnership?: GeneralStatus | null;
  initial_turnover?: string;
  current_turnover?: string;
  district?: string | null;
}

export interface UpdateEnterpriseInput {
  enterprise_name?: string;
  name?: string | null;
  business_sector?: BusinessSector;
  description?: string | null;
  address?: string | null;
  focus_commodity?: string | null;
  dispora_support?: string | null;
  legal_status?: LegalStatus | null;
  business_digitization?: BusinessDigitization | null;
  intervention_needs?: InterventionNeeds | null;
  training_status?: ProcessStatus | null;
  mentoring_status?: ProcessStatus | null;
  capital_access?: GeneralStatus | null;
  partnership?: GeneralStatus | null;
  initial_turnover?: string;
  current_turnover?: string;
  district?: string | null;
  status?: EnterpriseStatus;
}

export type EnterpriseAuditAction = 'create' | 'update' | 'delete' | string;

export interface EnterpriseAuditEvent {
  id: number;
  actor_public_id: string | null;
  actor_email: string | null;
  actor_name: string | null;
  action: EnterpriseAuditAction;
  changed_fields: Record<string, unknown> | null;
  created_at: number;
}

export interface EnterpriseAuditLogResponse {
  events: EnterpriseAuditEvent[];
  next_cursor?: string | null;
}

export interface EnterpriseAuditLogParams {
  cursor?: string;
  limit?: number;
}
