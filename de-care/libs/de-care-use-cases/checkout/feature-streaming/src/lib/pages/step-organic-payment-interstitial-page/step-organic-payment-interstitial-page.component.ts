import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit, NgModule } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { getSelectedPlanIsMusicShowcase, getPaymentInterstitialBulletsViewModel } from '@de-care/de-care-use-cases/checkout/state-streaming';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { ReactiveComponentModule } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../routing/page-step-route-configuration';
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'step-organic-payment-interstitial-page',
    templateUrl: './step-organic-payment-interstitial-page.component.html',
    styleUrls: ['./step-organic-payment-interstitial-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepOrganicPaymentInterstitialPageComponent implements ComponentWithLocale, OnInit, AfterViewInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    pageStepRouteConfiguration: PageStepRouteConfiguration;
    showBenefitsForMusicShowcase$ = this._store.select(getSelectedPlanIsMusicShowcase);
    getPaymentInterstitialBulletsViewModel$ = this._store.select(getPaymentInterstitialBulletsViewModel);

    constructor(readonly translationsForComponentService: TranslationsForComponentService, private readonly _activatedRoute: ActivatedRoute, private readonly _store: Store) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {
        this.pageStepRouteConfiguration = GetPageStepRouteConfiguration(this._activatedRoute);
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'paymentinterstitialstep' }));
    }
}

@NgModule({
    declarations: [StepOrganicPaymentInterstitialPageComponent],
    exports: [StepOrganicPaymentInterstitialPageComponent],
    imports: [CommonModule, RouterModule, TranslateModule, ReactiveComponentModule, SharedSxmUiUiStepperModule, SharedSxmUiUiDataClickTrackModule],
})
export class StepOrganicPaymentInterstitialPageComponentModule {}
