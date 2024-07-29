import { AfterViewInit, Component } from '@angular/core';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { LANGUAGE_CODES } from '@de-care/shared/translation';
import { map } from 'rxjs/operators';
import { PrintService } from '@de-care/shared/browser-common/window-print';
import {
    getConfirmationPageViewModel,
    getIsStreaming,
    getSubscriptionIdPrimaryRadio,
    getSubscriptionIdSecondaryRadio,
} from '@de-care/de-care-use-cases/checkout/state-upgrade-vip';
import { scrollToTop } from '@de-care/browser-common';
import { getIsRefreshAllowed } from '@de-care/de-care-use-cases/checkout/state-common';

@Component({
    selector: 'de-care-confirmation-page',
    templateUrl: './confirmation-page.component.html',
    styleUrls: ['./confirmation-page.component.scss'],
})
export class ConfirmationPageComponent implements AfterViewInit {
    translateKeyPrefix = 'DeCareUseCasesCheckoutFeatureUpgradeVipModule.ConfirmationPageComponent.';
    confirmationPageData$ = this._store.select(getConfirmationPageViewModel);
    isStreaming$ = this._store.select(getIsStreaming);
    isRefreshAllowed$ = this._store.select(getIsRefreshAllowed);
    currentLang$ = this._translateService.onLangChange.pipe(map((ev) => ev.lang));

    currentLangIsFrench$ = this._translateService.onLangChange.pipe(map((ev) => ev?.lang === LANGUAGE_CODES.FR_CA));

    primaryRadioSubscriptionId$ = this._store.select(getSubscriptionIdPrimaryRadio);
    secondaryRadioSubscriptionId$ = this._store.select(getSubscriptionIdSecondaryRadio);

    constructor(private readonly _store: Store, private readonly _translateService: TranslateService, private readonly _printService: PrintService) {}

    ngAfterViewInit(): void {
        scrollToTop();
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Confirmation' }));
    }

    onPrintClick() {
        this._printService.print();
    }
}
