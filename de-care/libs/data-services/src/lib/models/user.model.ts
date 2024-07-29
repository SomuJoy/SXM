export interface UserModel {
    readonly id?: number | string;
    firstName: string;
    lastName?: string;
    email?: string;
    password?: string;
}
