import { Component, AfterViewInit } from '@angular/core';
import { selectResellerCode } from '@de-care/de-care-use-cases/third-party-billing/state-provision-account';
import { Store } from '@ngrx/store';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import { TranslateService } from '@ngx-translate/core';
import { switchMap } from 'rxjs/operators';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';

@Component({
    selector: 'de-care-already-active',
    templateUrl: './already-active.component.html',
    styleUrls: ['./already-active.component.scss']
})
export class AlreadyActiveComponent implements AfterViewInit {
    translateKeyPrefix = 'deCareUseCasesThirdPartyBillingModule.alreadyActivePageComponent';
    translateRootKeyPrefix = 'deCareUseCasesThirdPartyBillingModule';

    resellerName$ = this._store
        .select(selectResellerCode)
        .pipe(switchMap(_resellerCode => this._translateService.stream(`${this.translateRootKeyPrefix}.${_resellerCode}.NAME`)));

    resellerURL$ = this._store
        .select(selectResellerCode)
        .pipe(switchMap(_resellerCode => this._translateService.stream(`${this.translateRootKeyPrefix}.${_resellerCode}.URL`)));

    constructor(private readonly _store: Store, private _translateService: TranslateService) {}

    ngAfterViewInit() {
        this._store.dispatch(pageDataFinishedLoading());
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'thirdpartybilling', componentKey: 'TPBentitlementActive' }));
    }
}
