import client from '@/api/client';
import type { ProfileResponse, UpdateProfileParams } from '@/api/profile/profile';
import { API_ENDPOINTS, resolveMediaUrl } from '@/utils/constant';

function normalizeProfileResponse(data: ProfileResponse): ProfileResponse {
  return {
    ...data,
    profile_photo_url: data.profile_photo_url
      ? resolveMediaUrl(data.profile_photo_url)
      : null,
  };
}

function buildProfileFormData(params: UpdateProfileParams): FormData {
  const formData = new FormData();

  formData.append('name', params.name);
  formData.append('email', params.email);
  formData.append('phone', params.phone);
  formData.append('age', String(params.age));
  formData.append('gender', String(params.gender));
  formData.append('address', params.address);

  if (params.avatar) {
    formData.append('avatar', {
      uri: params.avatar.uri,
      name: params.avatar.name,
      type: params.avatar.type,
    } as any);
  }

  return formData;
}

export const fetchProfileApi = async (): Promise<ProfileResponse> => {
  const response = await client.get<ProfileResponse>(API_ENDPOINTS.PROFILE);
  return normalizeProfileResponse(response.data);
};

export const updateProfileApi = async (
  params: UpdateProfileParams,
): Promise<ProfileResponse> => {
  await client.post(
    API_ENDPOINTS.PROFILE,
    buildProfileFormData(params),
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return fetchProfileApi();
};
