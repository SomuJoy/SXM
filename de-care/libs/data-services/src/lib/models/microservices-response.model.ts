export interface MicroservicesResponse<T> {
    status: string;
    httpStatusCode: string;
    httpStatus: string;
    data: T;
}
