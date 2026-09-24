import { apiRequest } from '@/lib/api/client';

import type {
  CreateTrainingCatalogInput,
  EnrollTrainingInput,
  EnrollmentListParams,
  EnrollmentListResponse,
  TrainingCatalog,
  TrainingCatalogListParams,
  TrainingCatalogListResponse,
  TrainingEnrollment,
  UpdateEnrollmentStatusInput,
  UpdateTrainingCatalogInput,
  UpdateTrainingCatalogStatusInput,
  UploadThumbnailResponse,
} from '@/types/trainings';

export function listTrainingCatalogs(
  params: TrainingCatalogListParams = {}
): Promise<TrainingCatalogListResponse> {
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

  if (params.q?.trim()) {
    search.set('q', params.q.trim());
  }

  if (params.title?.trim()) {
    search.set('title', params.title.trim());
  }

  if (params.mentor?.trim()) {
    search.set('mentor', params.mentor.trim());
  }

  if (params.category?.trim()) {
    search.set('category', params.category.trim());
  }

  if (params.training_status?.trim()) {
    search.set('training_status', params.training_status.trim());
  }

  if (params.start_date?.trim()) {
    search.set('start_date', params.start_date.trim());
  }

  if (params.order?.trim()) {
    search.set('order', params.order.trim());
  }

  const query = search.toString();
  const path = query ? `/training-catalog?${query}` : '/training-catalog';

  return apiRequest<TrainingCatalogListResponse>(path);
}

export function getTrainingCatalog(publicId: string): Promise<TrainingCatalog> {
  return apiRequest<TrainingCatalog>(`/training-catalog/${encodeURIComponent(publicId)}`);
}

export function createTrainingCatalog(input: CreateTrainingCatalogInput): Promise<TrainingCatalog> {
  return apiRequest<TrainingCatalog>('/training-catalog', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function uploadTrainingThumbnail(file: File): Promise<UploadThumbnailResponse> {
  const formData = new FormData();
  formData.append('thumbnail', file);

  return apiRequest<UploadThumbnailResponse>('/training-catalog/upload-thumbnail', {
    method: 'POST',
    body: formData,
  });
}

export function updateTrainingCatalog(
  publicId: string,
  input: UpdateTrainingCatalogInput
): Promise<TrainingCatalog> {
  return apiRequest<TrainingCatalog>(`/training-catalog/${encodeURIComponent(publicId)}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function updateTrainingCatalogStatus(
  publicId: string,
  input: UpdateTrainingCatalogStatusInput
): Promise<TrainingCatalog> {
  return apiRequest<TrainingCatalog>(`/training-catalog/${encodeURIComponent(publicId)}/status`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteTrainingCatalog(publicId: string): Promise<void> {
  return apiRequest<void>(`/training-catalog/${encodeURIComponent(publicId)}`, {
    method: 'DELETE',
  });
}

export function enrollTraining(input: EnrollTrainingInput): Promise<TrainingEnrollment> {
  return apiRequest<TrainingEnrollment>('/training-enrollments', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateEnrollmentStatus(
  publicId: string,
  input: UpdateEnrollmentStatusInput
): Promise<TrainingEnrollment> {
  return apiRequest<TrainingEnrollment>(
    `/training-enrollments/${encodeURIComponent(publicId)}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify(input),
    }
  );
}

export function cancelEnrollment(publicId: string): Promise<void> {
  return apiRequest<void>(`/training-enrollments/${encodeURIComponent(publicId)}`, {
    method: 'DELETE',
  });
}

export function listMyEnrollments(
  params: EnrollmentListParams = {}
): Promise<EnrollmentListResponse> {
  const search = new URLSearchParams();

  if (params.cursor) {
    search.set('cursor', params.cursor);
  }

  if (params.limit !== undefined) {
    search.set('limit', String(params.limit));
  }

  if (params.status?.trim()) {
    search.set('status', params.status.trim());
  }

  if (params.search?.trim()) {
    search.set('search', params.search.trim());
  }

  const query = search.toString();
  const path = query ? `/training-enrollments/my?${query}` : '/training-enrollments/my';

  return apiRequest<EnrollmentListResponse>(path);
}

export function listAllEnrollments(
  params: EnrollmentListParams = {}
): Promise<EnrollmentListResponse> {
  const search = new URLSearchParams();

  if (params.cursor) {
    search.set('cursor', params.cursor);
  }

  if (params.limit !== undefined) {
    search.set('limit', String(params.limit));
  }

  if (params.status?.trim()) {
    search.set('status', params.status.trim());
  }

  if (params.search?.trim()) {
    search.set('search', params.search.trim());
  }

  const query = search.toString();
  const path = query ? `/training-enrollments?${query}` : '/training-enrollments';

  return apiRequest<EnrollmentListResponse>(path);
}

export function listCatalogEnrollments(
  catalogPublicId: string,
  params: EnrollmentListParams = {}
): Promise<EnrollmentListResponse> {
  const search = new URLSearchParams();

  if (params.cursor) {
    search.set('cursor', params.cursor);
  }

  if (params.limit !== undefined) {
    search.set('limit', String(params.limit));
  }

  if (params.status?.trim()) {
    search.set('status', params.status.trim());
  }

  if (params.search?.trim()) {
    search.set('search', params.search.trim());
  }

  const query = search.toString();
  const path = query
    ? `/training-enrollments/catalog/${encodeURIComponent(catalogPublicId)}?${query}`
    : `/training-enrollments/catalog/${encodeURIComponent(catalogPublicId)}`;

  return apiRequest<EnrollmentListResponse>(path);
}
