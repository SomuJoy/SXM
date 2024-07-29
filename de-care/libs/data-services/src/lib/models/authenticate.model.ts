export interface AuthenticateRequest {
    token: {
        password: string;
        username: string;
        refresh_token?: string;
    };
    environmentData?: {
        userBehaviorPayload: string;
    };
}

export interface AuthenticateResponse {
    accountNum: string;
    refreshToken: string;
}
