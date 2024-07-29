export interface MicroservicesResponse<T> {
    data: T;
}

export interface PromoCodeValidateResponse {
    status: string;
    promoCode: string;
}
