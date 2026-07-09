import client from '@/api/client';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, VerifyOtpRequest, VerifyOtpResponse } from '@/api/auth/auth';
import { API_ENDPOINTS } from '@/utils/constant';

export const loginApi = async (
    data: LoginRequest
): Promise<LoginResponse> => {
    const response = await client.post<LoginResponse>(
        API_ENDPOINTS.LOGIN,
        data
    );
    return response.data;
};

export const verifyOtpApi = async (
    data: VerifyOtpRequest
): Promise<VerifyOtpResponse> => {
    const response = await client.post<VerifyOtpResponse>(
        API_ENDPOINTS.LOGIN_VERIFY,
        data
    );
    return response.data;
};

export const registerApi = async (
    data: RegisterRequest
): Promise<RegisterResponse> => {
    const response = await client.post<RegisterResponse>(
        API_ENDPOINTS.REGISTER,
        data
    );
    return response.data;
};