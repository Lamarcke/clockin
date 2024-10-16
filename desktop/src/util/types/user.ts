export interface User {
    id: number;
    name: string;
    identifier: string;
}

export interface UserVerification {
    user_id: number;
    created_at: string;
}
