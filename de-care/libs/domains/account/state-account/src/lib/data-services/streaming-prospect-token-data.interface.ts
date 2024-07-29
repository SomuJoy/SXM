export interface StreamingProspectTokenDataServiceResponse {
    userName: string;
    firstName?: string;
    lastName?: string;
    streetAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phone?: string;
}

export interface StreamingProspectTokenPayload {
    token: string;
    tokenType: string;
}
