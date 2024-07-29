import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../routing/page-step-route-configuration';
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

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'step-targeted-payment-interstitial-page',
    templateUrl: 'step-targeted-payment-interstitial-page.component.html',
    styleUrls: ['step-targeted-payment-interstitial-page.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        SharedSxmUiUiStepperModule,
        PaymentInterstitialInfoComponentModule,
        SharedSxmUiUiDataClickTrackModule,
        SharedSxmUiUiProceedButtonModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepTargetedPaymentInterstitialPageComponent implements ComponentWithLocale, OnInit {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    pageStepRouteConfiguration: PageStepRouteConfiguration;

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
