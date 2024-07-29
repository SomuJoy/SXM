// ===============================================================================
// Angular
import { Injectable } from '@angular/core';
import { IdentityRequestModel } from '../models/identity.model';

@Injectable({ providedIn: 'root' })
export class DataIdentityRequestStoreService {
    private _identityRequestData: IdentityRequestModel = { requestType: '' };

    public getIdentityRequestData(): IdentityRequestModel {
        return this._identityRequestData;
    }

    public setIdentityRequestData(value: IdentityRequestModel) {
        this._identityRequestData = value;
    }
}
