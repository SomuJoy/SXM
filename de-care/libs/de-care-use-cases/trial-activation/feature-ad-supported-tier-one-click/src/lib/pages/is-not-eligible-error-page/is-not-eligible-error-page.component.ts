import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { LANGUAGE_CODES } from '@de-care/shared/translation';

@Component({
    selector: 'de-care-is-not-eligible-error-page',
    templateUrl: './is-not-eligible-error-page.component.html',
    styleUrls: ['./is-not-eligible-error-page.component.scss'],
})
export class IsNotEligibleErrorPageComponent implements OnInit, AfterViewInit {
    readonly translateKeyPrefix = 'DeCareUseCasesTrialActivationFeatureAdSupportedTierOneClickModule.IsNotEligibleErrorPageComponent';

    constructor(private readonly _store: Store, private readonly _translateService: TranslateService) {}

    currentLangIsFrench$ = this._translateService.onLangChange.pipe(map((ev) => ev?.lang === LANGUAGE_CODES.FR_CA));

    ngOnInit(): void {
        this._store.dispatch(pageDataFinishedLoading());
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'TRIAL_ACTIVATION', componentKey: 'Radio not eligible' }));
    }
}
