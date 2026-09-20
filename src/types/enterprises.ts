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
  name: string | null;
  business_sector: BusinessSector;
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

export interface EnterpriseListResponse {
  enterprises: Enterprise[];
  next_cursor?: string;
}

export interface EnterpriseListParams {
  cursor?: string;
  limit?: number;
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
  name?: string | null;
  business_sector: BusinessSector;
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
