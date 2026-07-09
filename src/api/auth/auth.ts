export interface LoginRequest {
    phone: string;
}

export interface LoginResponse {
    status: string;
    message: string;
    otp: string;
}

export interface VerifyOtpRequest {
    phone?: string;
    otp?: string;
}

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    phone: string;
    survey_completed: number;
}

export interface VerifyOtpResponse {
    status: boolean;
    message: string;
    token: string;
    user?: AuthUser;
}

export interface RegisterRequest {
    name: string;
    age: number;
    gender: number;
    email: string;
    phone: string;
}

export interface RegisterResponse {
    status: boolean;
    message: string;
    otp: string;
}