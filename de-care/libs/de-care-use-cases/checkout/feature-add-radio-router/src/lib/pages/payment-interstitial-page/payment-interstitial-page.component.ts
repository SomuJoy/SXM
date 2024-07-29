import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../routes/page-step-route-configuration';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { PaymentInterstitialInfoComponentModule } from '../../page-parts/payment-interstitial-info/payment-interstitial-info.component';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SxmUiVehicleYmmInfoComponentModule } from '@de-care/shared/sxm-ui/ui-vehicle-ymm-info';
import { getPaymentInterstitialPageViewModel } from '@de-care/de-care-use-cases/checkout/state-add-radio-router';
import { SharedSxmUiUiIconCheckmarkModule } from '@de-care/shared/sxm-ui/ui-icon-checkmark';
import { ReactiveComponentModule } from '@ngrx/component';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-payment-interstitial-page',
    templateUrl: './payment-interstitial-page.component.html',
    styleUrls: ['./payment-interstitial-page.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveComponentModule,
        SharedSxmUiUiStepperModule,
        SharedSxmUiUiIconCheckmarkModule,
        PaymentInterstitialInfoComponentModule,
        SharedSxmUiUiDataClickTrackModule,
        SharedSxmUiUiProceedButtonModule,
        SxmUiVehicleYmmInfoComponentModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentInterstitialPageComponent implements ComponentWithLocale, OnInit {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    pageStepRouteConfiguration: PageStepRouteConfiguration;
    viewModel$ = this._store.select(getPaymentInterstitialPageViewModel);

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _router: Router,
        private readonly _store: Store
    ) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'paymentinterstitialstep' }));
        this.pageStepRouteConfiguration = GetPageStepRouteConfiguration(this._activatedRoute);
    }

    goToNextStep() {
        this._router.navigate([this.pageStepRouteConfiguration.routeUrlNext], { relativeTo: this._activatedRoute, queryParamsHandling: 'preserve' });
    }
}
