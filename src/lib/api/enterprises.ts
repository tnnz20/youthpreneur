import { apiRequest } from '@/lib/api/client';

import type {
  CreateEnterpriseInput,
  Enterprise,
  EnterpriseAuditLogParams,
  EnterpriseAuditLogResponse,
  EnterpriseListParams,
  EnterpriseListResponse,
  PublicEnterpriseListParams,
  PublicEnterpriseListResponse,
  UpdateEnterpriseInput,
} from '@/types/enterprises';

export function listEnterprises(
  params: EnterpriseListParams = {}
): Promise<EnterpriseListResponse> {
  const search = new URLSearchParams();

  if (params.cursor) {
    search.set('cursor', params.cursor);
  }

  if (params.limit !== undefined) {
    search.set('limit', String(params.limit));
  }

  if (params.search?.trim()) {
    search.set('search', params.search.trim());
  }

  if (params.district?.trim()) {
    search.set('district', params.district.trim());
  }

  if (params.status) {
    search.set('status', params.status);
  }

  if (params.business_sector?.trim()) {
    search.set('business_sector', params.business_sector.trim());
  }

  if (params.legal_status) {
    search.set('legal_status', params.legal_status);
  }

  if (params.business_digitization) {
    search.set('business_digitization', params.business_digitization);
  }

  if (params.intervention_needs?.trim()) {
    search.set('intervention_needs', params.intervention_needs.trim());
  }

  if (params.training_status) {
    search.set('training_status', params.training_status);
  }

  if (params.mentoring_status) {
    search.set('mentoring_status', params.mentoring_status);
  }

  if (params.capital_access) {
    search.set('capital_access', params.capital_access);
  }

  if (params.partnership) {
    search.set('partnership', params.partnership);
  }

  const query = search.toString();

  return apiRequest<EnterpriseListResponse>(`/enterprises${query ? `?${query}` : ''}`);
}

export function listPublicEnterprises(
  params: PublicEnterpriseListParams = {}
): Promise<PublicEnterpriseListResponse> {
  const search = new URLSearchParams();

  if (params.cursor) {
    search.set('cursor', params.cursor);
  }

  if (params.limit !== undefined) {
    search.set('limit', String(params.limit));
  }

  if (params.search?.trim()) {
    search.set('search', params.search.trim());
  }

  if (params.district?.trim()) {
    search.set('district', params.district.trim());
  }

  if (params.intervention_needs?.trim()) {
    search.set('intervention_needs', params.intervention_needs.trim());
  }

  if (params.business_sector?.trim()) {
    search.set('business_sector', params.business_sector.trim());
  }

  const query = search.toString();

  return apiRequest<PublicEnterpriseListResponse>(`/enterprises/public${query ? `?${query}` : ''}`);
}

export function getEnterprise(publicId: string): Promise<Enterprise> {
  return apiRequest<Enterprise>(`/enterprises/${publicId}`);
}

export function createEnterprise(input: CreateEnterpriseInput): Promise<Enterprise> {
  return apiRequest<Enterprise>('/enterprises', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateEnterprise(
  publicId: string,
  input: UpdateEnterpriseInput
): Promise<Enterprise> {
  return apiRequest<Enterprise>(`/enterprises/${publicId}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteEnterprise(publicId: string): Promise<void> {
  return apiRequest<void>(`/enterprises/${publicId}`, { method: 'DELETE' });
}

export function listEnterpriseAuditLogs(
  publicId: string,
  params: EnterpriseAuditLogParams = {}
): Promise<EnterpriseAuditLogResponse> {
  const search = new URLSearchParams();

  if (params.cursor) {
    search.set('cursor', params.cursor);
  }

  if (params.limit !== undefined) {
    search.set('limit', String(params.limit));
  }

  const query = search.toString();

  return apiRequest<EnterpriseAuditLogResponse>(
    `/enterprises/${encodeURIComponent(publicId)}/audit-logs${query ? `?${query}` : ''}`
  );
}
