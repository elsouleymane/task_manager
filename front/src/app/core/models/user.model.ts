export interface User {
    id?: string;
    username: string;
    email?: string;
    createdAt?: string;
}

export interface UserCredentials {
    username: string;
    password: string;
}

export interface AuthResponse {
    token: string;
}

export interface RegisterResponse {
    id: string;
    username: string;
    email?: string;
}
