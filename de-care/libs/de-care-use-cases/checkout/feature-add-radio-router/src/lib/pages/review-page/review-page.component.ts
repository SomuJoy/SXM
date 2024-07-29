import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeCareSharedUiPageLayoutModule } from '@de-care/de-care-shared-ui-page-layout';
import { getReviewPageViewModel, SubmitAddRadioRouterTransactionWorkflowService } from '@de-care/de-care-use-cases/checkout/state-add-radio-router';
import { DeCareUseCasesCheckoutUiCommonModule } from '@de-care/de-care-use-cases/checkout/ui-common';
import { SharedSxmUiUiLoadingOverlayModule } from '@de-care/shared/sxm-ui/ui-loading-overlay';
import { SharedSxmUiUiPrimaryPackageCardModule } from '@de-care/shared/sxm-ui/ui-primary-package-card';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { SxmUiVehicleYmmInfoComponentModule } from '@de-care/shared/sxm-ui/ui-vehicle-ymm-info';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { ReactiveComponentModule } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../routes/page-step-route-configuration';
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-review-page',
    templateUrl: './review-page.component.html',
    styleUrls: ['./review-page.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        TranslateModule,
        DeCareSharedUiPageLayoutModule,
        SharedSxmUiUiStepperModule,
        SxmUiVehicleYmmInfoComponentModule,
        ReactiveComponentModule,
        SharedSxmUiUiPrimaryPackageCardModule,
        DeCareUseCasesCheckoutUiCommonModule,
        SharedSxmUiUiLoadingOverlayModule,
    ],
})
export class ReviewPageComponent implements ComponentWithLocale, OnInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    pageStepRouteConfiguration: PageStepRouteConfiguration;
    viewModel$ = this._store.select(getReviewPageViewModel);
    showFullViewLoader$ = new BehaviorSubject(false);

    constructor(
        private readonly _store: Store,
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _router: Router,
        private readonly _submitAddRadioRouterTransactionWorkflowService: SubmitAddRadioRouterTransactionWorkflowService
    ) {
        translationsForComponentService.init(this);
    }
    ngOnInit(): void {
        this.pageStepRouteConfiguration = GetPageStepRouteConfiguration(this._activatedRoute);
    }

    submitTransaction() {
        this._submitAddRadioRouterTransactionWorkflowService.build().subscribe({
            next: () => {
                this._router.navigate([this.pageStepRouteConfiguration.routeUrlNext], { relativeTo: this._activatedRoute });
            },
            error: (error) => {
                this.showFullViewLoader$.next(false);
                switch (error) {
                    case 'CREDIT_CARD_FAILURE': {
                        this._router.navigate([this.pageStepRouteConfiguration.paymentMethodRouteUrl], {
                            relativeTo: this._activatedRoute,
                            queryParamsHandling: 'preserve',
                            state: { ccError: true },
                        });
                        break;
                    }
                    default: {
                        this._router.navigate([this.pageStepRouteConfiguration.paymentMethodRouteUrl], {
                            relativeTo: this._activatedRoute,
                            queryParamsHandling: 'preserve',
                            state: { systemError: true },
                        });
                        break;
                    }
                }
            },
        });
    }
}
