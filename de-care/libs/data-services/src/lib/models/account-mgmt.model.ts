export interface SweepstakesRequest {
    radioId: string;
    contestId: string;
    dateOfBirth: string;
}

export interface SweepstakesResponse {
    status: SweepstakesSubmitStatus;
}

export enum SweepstakesSubmitStatus {
    SUCCESS,
    DUPLICATE_EMAIL,
    INVALID_DOB,
    ERROR
}
