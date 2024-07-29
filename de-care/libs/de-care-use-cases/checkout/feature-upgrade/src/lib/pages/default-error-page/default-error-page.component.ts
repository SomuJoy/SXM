import { AfterViewInit, Component, OnInit } from '@angular/core';
import { finishPageLoading } from '@de-care/de-care-use-cases/checkout/state-upgrade';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import { LANGUAGE_CODES } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';

@Component({
    selector: 'de-care-default-error-page',
    templateUrl: './default-error-page.component.html',
    styleUrls: ['./default-error-page.component.scss'],
})
export class DefaultErrorPageComponent implements OnInit, AfterViewInit {
    readonly translateKeyPrefix = 'DeCareUseCasesCheckoutFeatureUpgradeModule.DefaultErrorPageComponent.';

    constructor(private readonly _store: Store, private readonly _translateService: TranslateService) {}

    currentLangIsFrench$ = this._translateService.onLangChange.pipe(map((ev) => ev?.lang === LANGUAGE_CODES.FR_CA));

    ngOnInit(): void {
        this._store.dispatch(finishPageLoading());
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'CHECKOUT', componentKey: "Transaction can't be completed online" }));
    }
}
