import { Component, Input } from '@angular/core';
import { getIncludeChatWithAnAgentLink, selectLookupErrors } from '@de-care/de-care-use-cases/account/state-registration';
import { Store } from '@ngrx/store';

@Component({
    selector: 'de-care-ui-lookup-by-radio-id-or-account-number-errors',
    templateUrl: './ui-lookup-by-radio-id-or-account-number-errors.component.html',
    styleUrls: ['./ui-lookup-by-radio-id-or-account-number-errors.component.scss']
})
export class UiLookupByRadioIdOrAccountNumberErrorsComponent {
    @Input() controlInvalid: false;

    translateKeyPrefix = 'deCareUseCasesAccountFeatureRegistration.UiLookupByRadioIdOrAccountNumberComponent';
    lookupErrors$ = this._store.select(selectLookupErrors);
    includeChatWithAgentLink$ = this._store.select(getIncludeChatWithAnAgentLink);

    constructor(private readonly _store: Store) {}
}
