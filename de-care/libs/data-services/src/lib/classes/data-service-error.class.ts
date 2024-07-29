// ===============================================================================
// Interfaces
import { IRequestData } from '../interfaces/request-data.interface';

//********************************************************************************
export class DataServiceError {
    //================================================
    //===                Variables                 ===
    //================================================
    readonly message: string;

    //================================================
    //===               Constructor                ===
    //================================================
    constructor(public error: any, public requestData: IRequestData) {
        this.message = (error.error && error.error.message) || (error.message || (error.body && error.body.error) || error).toString();
    }
}
