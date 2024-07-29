import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject } from '@angular/core';
import { getConfirmationDataForAddSecondRadio, getIsStreaming } from '@de-care/de-care-use-cases/checkout/state-upgrade-vip';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { getLanguagePrefix } from '@de-care/domains/customer/state-locale';
import { PrintService } from '@de-care/shared/browser-common/window-print';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { getOACUrl } from '@de-care/shared/state-settings';
import { LANGUAGE_CODES } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
    selector: 'de-care-add-second-radio-confirmation-page',
    styleUrls: ['./add-second-radio-confimation-page.component.scss'],
    templateUrl: './add-second-radio-confimation-page.component.html',
})
export class AddSecondRadioConfirmationPageComponent implements AfterViewInit {
    translateKeyPrefix = 'DeCareUseCasesCheckoutFeatureUpgradeVipModule.AddSecondRadioConfirmationPageComponent.';
    isStreaming$ = this._store.select(getIsStreaming);
    currentLangIsFrench$ = this._translateService.onLangChange.pipe(map((ev) => ev?.lang === LANGUAGE_CODES.FR_CA));

    confirmationData$ = this._store.select(getConfirmationDataForAddSecondRadio);
    maskedUserName$ = this._store.select(getConfirmationDataForAddSecondRadio).pipe(
        map((confirmationData) => {
            if (confirmationData?.streamingAccount.userName) {
                let splitusername = confirmationData?.streamingAccount.userName.split('@');
                return splitusername?.[0]?.substring(0, 3) + '******' + splitusername?.[1];
            }
            return confirmationData?.streamingAccount.maskedUserName;
        })
    );
    secondRadioMaskedUsername: string;

    private readonly _window: Window;

    constructor(
        private readonly _store: Store,
        private readonly _printService: PrintService,
        private readonly _translateService: TranslateService,
        @Inject(DOCUMENT) document
    ) {
        this._window = document && document.defaultView;
    }
    ngAfterViewInit() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'confirmation' }));
        this._store.dispatch(pageDataFinishedLoading());
    }

    onGoToMyAccount(): void {
        combineLatest([this._store.select(getOACUrl), this._store.select(getLanguagePrefix)])
            .pipe(take(1))
            .subscribe(([oacUrl, lang]) => {
                const langPref = lang === 'en' ? '' : `&langpref=${lang}`;
                this._window.location.href = `${oacUrl}login_view.action?reset=true${langPref}`;
            });
    }

    onPrintClick() {
        this._printService.print();
    }
}
