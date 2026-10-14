import client from '@/api/client';
import type {
    RegisterDeviceTokenRequest,
    RegisterDeviceTokenResponse,
} from '@/api/deviceToken/deviceToken';
import { API_ENDPOINTS } from '@/utils/constant';

export const registerDeviceTokenApi = async (
    data: RegisterDeviceTokenRequest,
): Promise<RegisterDeviceTokenResponse> => {
    const response = await client.post<RegisterDeviceTokenResponse>(
        API_ENDPOINTS.DEVICE_TOKEN,
        data,
    );

    return response.data;
};
