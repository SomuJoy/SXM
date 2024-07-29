import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../routing/page-step-route-configuration';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { getPaymentInterstitialPageViewModel, LoadTargetedPurchaseDataIfNotAlreadyLoadedWorkflowService } from '@de-care/de-care-use-cases/checkout/state-satellite';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { PaymentInterstitialInfoComponent } from '../../page-parts/payment-interstitial-info/payment-interstitial-info.component';
import { CommonModule } from '@angular/common';
import { ReactiveComponentModule } from '@ngrx/component';
import { DeCareSharedUiPageLayoutModule } from '@de-care/de-care-shared-ui-page-layout';
import { SharedSxmUiUiIconCheckmarkModule } from '@de-care/shared/sxm-ui/ui-icon-checkmark';
import { NavigationPurchaseDataTargetedLoadResultsService } from '../../routing/navigation-purchase-data-targeted-load-results.service';
import { SxmUiVehicleYmmInfoComponentModule } from '@de-care/shared/sxm-ui/ui-vehicle-ymm-info';
import { SharedSxmUiUiToastNotificationModule } from '@de-care/shared/sxm-ui/ui-toast-notification';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'step-organic-payment-interstitial-page',
    templateUrl: 'step-organic-payment-interstitial-page.component.html',
    styleUrls: ['step-organic-payment-interstitial-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule,
        ReactiveComponentModule,
        DeCareSharedUiPageLayoutModule,
        SharedSxmUiUiIconCheckmarkModule,
        SharedSxmUiUiStepperModule,
        PaymentInterstitialInfoComponent,
        SharedSxmUiUiDataClickTrackModule,
        SxmUiVehicleYmmInfoComponentModule,
        SharedSxmUiUiToastNotificationModule,
    ],
})
export class StepOrganicPaymentInterstitialPageComponent implements ComponentWithLocale, OnInit {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    pageStepRouteConfiguration: PageStepRouteConfiguration;
    viewModel$ = this._store.select(getPaymentInterstitialPageViewModel);

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
