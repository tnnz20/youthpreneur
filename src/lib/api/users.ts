import { apiRequest } from '@/lib/api/client';

import type { User, UserListParams, UserListResponse, UserProfile } from '@/types/users';

export function listUsers(params: UserListParams): Promise<UserListResponse> {
  const search = new URLSearchParams();

  if (params.cursor) {
    search.set('cursor', params.cursor);
  }

  if (params.limit !== undefined) {
    search.set('limit', String(params.limit));
  }

  if (params.district) {
    search.set('district', params.district);
  }

  if (params.gender) {
    search.set('gender', params.gender);
  }

  if (params.search) {
    search.set('search', params.search);
  }

  const query = search.toString();

  return apiRequest<UserListResponse>(`/users${query ? `?${query}` : ''}`);
}

export function getUser(publicId: string): Promise<User> {
  return apiRequest<User>(`/users/${publicId}`);
}

export function updateUserStatus(publicId: string, isActive: boolean): Promise<User> {
  return apiRequest<User>(`/users/${publicId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ is_active: isActive }),
  });
}

export function updateUserProfile(publicId: string, profile: UserProfile): Promise<User> {
  return apiRequest<User>(`/users/${publicId}/profile`, {
    method: 'PUT',
    body: JSON.stringify(profile),
  });
}

export function resetUserPassword(publicId: string, newPassword: string): Promise<void> {
  return apiRequest<void>(`/users/${publicId}/password/reset`, {
    method: 'POST',
    body: JSON.stringify({ new_password: newPassword }),
  });
}

export function deleteUser(publicId: string): Promise<void> {
  return apiRequest<void>(`/users/${publicId}`, { method: 'DELETE' });
}
