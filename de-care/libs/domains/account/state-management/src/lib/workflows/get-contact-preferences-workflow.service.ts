import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';
import { GetContactPreferencesRequest, GetContactPreferencesService } from '../data-services/get-contact-preferences.service';
import { setContactPreferencesData } from '../state/actions';
import { ContactPreferences } from '../state/models';

@Injectable({ providedIn: 'root' })
export class GetContactPreferencesWorkflowService implements DataWorkflow<GetContactPreferencesRequest, boolean> {
    constructor(private readonly _getContactPreferencesService: GetContactPreferencesService, private readonly _store: Store) {}

    build(data: GetContactPreferencesRequest): Observable<boolean> {
        return this._getContactPreferencesService.build(data).pipe(
            tap((res) => {
                const contactPreferences: ContactPreferences = { encryptedXmlPayload: res.encryptedXmlPayload, generatedUrl: res.generatedUrl };
                this._store.dispatch(setContactPreferencesData({ contactPreferences }));
            }),
            mapTo(true)
        );
    }
}
