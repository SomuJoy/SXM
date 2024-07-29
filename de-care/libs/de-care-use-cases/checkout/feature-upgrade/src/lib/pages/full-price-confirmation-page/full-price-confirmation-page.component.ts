import { AfterViewInit, Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import { DOCUMENT } from '@angular/common';
import { PrintService } from '@de-care/shared/browser-common/window-print';
import {
    getConfirmationPageViewModel,
    getIsDealWithoutPartnerSiteSupportLink,
    getOACRedirectUrl,
    getSelectedPlanDealIsAmazon,
    getSelectedPlanDealType,
    getSelectedPlanDealViewModelForAmazon,
    SubmitAccountRegistrationWorkflowService,
} from '@de-care/de-care-use-cases/checkout/state-upgrade';
import { RegisterCredentialsState } from '@de-care/domains/account/ui-register';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'de-care-full-price-confirmation-page',
    templateUrl: './full-price-confirmation-page.component.html',
    styleUrls: ['./full-price-confirmation-page.component.scss'],
})
export class FullPriceConfirmationPageComponent implements AfterViewInit {
    translateKeyPrefix = 'DeCareUseCasesCheckoutFeatureUpgradeModule.FullPriceConfirmationPageComponent.';
    confirmationViewModel$ = this._store.select(getConfirmationPageViewModel);
    registerCredentialsState = RegisterCredentialsState.PasswordOnly;
    registrationCompleted$ = new BehaviorSubject(false);
    currentLang$ = this._translateService.onLangChange.pipe(
        startWith({ lang: this._translateService.currentLang }),
        map(({ lang }) => lang)
    );
    getSelectedPlanDealType$ = this._store.select(getSelectedPlanDealType);
    dealRedemptionInstructions$ = combineLatest([this.getSelectedPlanDealType$, this._translateService.stream(this.translateKeyPrefix + 'DEAL_REDEMPTION_INSTRUCTIONS')]).pipe(
        map(([dealType, dealRedemptionInstructions]) => {
            return dealRedemptionInstructions?.[dealType]
                ? {
                      title: dealRedemptionInstructions?.[dealType].TITLE,
                      productImage: dealRedemptionInstructions?.[dealType].image.src,
                      descriptions: [dealRedemptionInstructions?.[dealType].DESCRIPTION],
                  }
                : null;
        })
    );
    getIsDealWithoutPartnerSiteSupportLink$ = this._store.select(getIsDealWithoutPartnerSiteSupportLink);
    getSelectedPlanDealIsAmazon$ = this._store.select(getSelectedPlanDealIsAmazon);
    amazonDealViewModel$ = this._store.select(getSelectedPlanDealViewModelForAmazon);
    private readonly _window: Window;
    constructor(
        private readonly _store: Store,
        private _printService: PrintService,
        private _translateService: TranslateService,
        private readonly _submitAccountRegistrationWorkflowService: SubmitAccountRegistrationWorkflowService,
        @Inject(DOCUMENT) private readonly _document: Document
    ) {
        this._window = this._document && this._document.defaultView;
        this._document.body.scrollTop = 0;
    }

    ngAfterViewInit() {
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'CHECKOUT', componentKey: 'confirmation' }));
    }

    onRegisterAccount(registerData) {
        this._submitAccountRegistrationWorkflowService.build(registerData).subscribe({
            next: () => {
                this.registrationCompleted$.next(true);
            },
            error: () => {
                // TODO: show system error
            },
        });
    }

    onPrintClick(): void {
        this._printService.print();
    }

    backToMyAccount() {
        combineLatest([this._store.select(getOACRedirectUrl), this.currentLang$])
            .pipe(take(1))
            .subscribe(([oacUrl, lang]) => {
                lang = lang?.substring(0, 2);
                const langPref = lang === 'en' ? '' : `&langpref=${lang}`;
                this._window.location.href = `${oacUrl}login_view.action?reset=true${langPref}`;
            });
    }
}
