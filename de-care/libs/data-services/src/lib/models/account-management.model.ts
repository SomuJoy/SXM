export interface AccountManagamentDoNotCallRequestModel {
    phoneNumber: number;
    answer?: string;
    token?: string;
}

export interface AccountManagementDoNotCallResponseModel {
    resultCode: string;
}
