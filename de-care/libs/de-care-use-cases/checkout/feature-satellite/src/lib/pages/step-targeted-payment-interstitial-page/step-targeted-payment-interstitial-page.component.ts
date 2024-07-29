import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../routing/page-step-route-configuration';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { getPaymentInterstitialPageViewModel, LoadTargetedPurchaseDataIfNotAlreadyLoadedWorkflowService } from '@de-care/de-care-use-cases/checkout/state-satellite';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SxmUiVehicleYmmInfoComponentModule } from '@de-care/shared/sxm-ui/ui-vehicle-ymm-info';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { PaymentInterstitialInfoComponent } from '../../page-parts/payment-interstitial-info/payment-interstitial-info.component';
import { CommonModule } from '@angular/common';
import { suspensify } from '@jscutlery/operators';
import { SxmUiButtonCtaSkeletonLoaderComponentModule } from '@de-care/shared/sxm-ui/ui-button-cta';
import { SxmUiSkeletonLoaderTextCopyComponentModule } from '@de-care/shared/sxm-ui/ui-skeleton-loader-panel';
import { ReactiveComponentModule } from '@ngrx/component';
import { DeCareSharedUiPageLayoutModule } from '@de-care/de-care-shared-ui-page-layout';
import { SharedSxmUiUiIconCheckmarkModule } from '@de-care/shared/sxm-ui/ui-icon-checkmark';
import { NavigationPurchaseDataTargetedLoadResultsService } from '../../routing/navigation-purchase-data-targeted-load-results.service';

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
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule,
        ReactiveComponentModule,
        DeCareSharedUiPageLayoutModule,
        SharedSxmUiUiIconCheckmarkModule,
        SxmUiVehicleYmmInfoComponentModule,
        SharedSxmUiUiStepperModule,
        PaymentInterstitialInfoComponent,
        SharedSxmUiUiDataClickTrackModule,
        SxmUiButtonCtaSkeletonLoaderComponentModule,
        SxmUiSkeletonLoaderTextCopyComponentModule,
    ],
})
export class StepTargetedPaymentInterstitialPageComponent implements ComponentWithLocale, OnInit {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    pageStepRouteConfiguration: PageStepRouteConfiguration;
    viewModel$ = this._store.select(getPaymentInterstitialPageViewModel);
    offerLoad$ = this._loadTargetedPurchaseDataIfNotAlreadyLoadedWorkflowService.build().pipe(
        suspensify(),
        tap(({ error }) => {
            if (error) {
                this._navigationPurchaseDataTargetedLoadResultsService.reRouteForNegativeScenario(error, this._activatedRoute.snapshot);
            }
        })
    );

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _store: Store,
        private readonly _loadTargetedPurchaseDataIfNotAlreadyLoadedWorkflowService: LoadTargetedPurchaseDataIfNotAlreadyLoadedWorkflowService,
        private readonly _navigationPurchaseDataTargetedLoadResultsService: NavigationPurchaseDataTargetedLoadResultsService
    ) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'paymentinterstitialstep' }));
        this.pageStepRouteConfiguration = GetPageStepRouteConfiguration(this._activatedRoute);
    }
}
