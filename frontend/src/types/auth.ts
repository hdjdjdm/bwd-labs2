export interface LoginResponse {
    token: string;
    username: string;
    message: string;
}

export interface RegisterResponse {
    status: number;
    message: string;
}
