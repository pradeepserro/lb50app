export interface RegisterDeviceTokenRequest {
    fcm_token: string;
    device_type: 'android';
}

export interface RegisterDeviceTokenResponse {
    status?: boolean;
    message?: string;
    [key: string]: unknown;
}
