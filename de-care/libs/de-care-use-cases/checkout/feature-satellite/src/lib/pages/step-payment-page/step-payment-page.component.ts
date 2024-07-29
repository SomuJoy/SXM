import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../routing/page-step-route-configuration';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { PaymentInfoData, PaymentInfoFormComponent, PaymentInfoFormComponentApi } from '@de-care/de-care-use-cases/checkout/ui-common';
import {
    collectPaymentInfo,
    LoadPurchaseReviewDataWorkflowService,
    LoadTargetedPurchaseDataIfNotAlreadyLoadedWorkflowService,
    getPaymentMethodStepPageViewModel,
} from '@de-care/de-care-use-cases/checkout/state-satellite';
import { BehaviorSubject } from 'rxjs';
import { CommonModule, DOCUMENT, Location } from '@angular/common';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';
import { filter, map, tap } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';
import { SxmUiVehicleYmmInfoComponentModule } from '@de-care/shared/sxm-ui/ui-vehicle-ymm-info';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { SharedSxmUiUiPrimaryPackageCardModule } from '@de-care/shared/sxm-ui/ui-primary-package-card';
import { SharedSxmUiUiLoadingWithAlertMessageModule } from '@de-care/shared/sxm-ui/ui-loading-with-alert-message';
import { suspensify } from '@jscutlery/operators';
import { SxmUiSkeletonLoaderPanelComponentModule, SxmUiSkeletonLoaderTextCopyComponentModule } from '@de-care/shared/sxm-ui/ui-skeleton-loader-panel';
import { ReactiveComponentModule } from '@ngrx/component';
import { DeCareSharedUiPageLayoutModule } from '@de-care/de-care-shared-ui-page-layout';
import { SxmUiSkeletonLoaderPaymentMethodsComponent } from '@de-care/shared/sxm-ui/ui-skeleton-loader-payment-methods';
import { SxmUiButtonCtaSkeletonLoaderComponentModule } from '@de-care/shared/sxm-ui/ui-button-cta';
import { NavigationPurchaseDataTargetedLoadResultsService } from '../../routing/navigation-purchase-data-targeted-load-results.service';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'step-payment-page',
    templateUrl: './step-payment-page.component.html',
    styleUrls: ['./step-payment-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveComponentModule,
        DeCareSharedUiPageLayoutModule,
        SxmUiVehicleYmmInfoComponentModule,
        SharedSxmUiUiStepperModule,
        SharedSxmUiUiPrimaryPackageCardModule,
        PaymentInfoFormComponent,
        SharedSxmUiUiLoadingWithAlertMessageModule,
        SxmUiSkeletonLoaderPanelComponentModule,
        SxmUiSkeletonLoaderTextCopyComponentModule,
        SxmUiButtonCtaSkeletonLoaderComponentModule,
        SxmUiSkeletonLoaderPaymentMethodsComponent,
    ],
})
export class StepPaymentPageComponent implements ComponentWithLocale, OnInit, AfterViewInit {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    pageStepRouteConfiguration: PageStepRouteConfiguration;
    @ViewChild(PaymentInfoFormComponent) private readonly _paymentInfoFormComponent: PaymentInfoFormComponentApi;
    displayIneligibleLoader$ = new BehaviorSubject(false);
    viewModel$ = this._store.select(getPaymentMethodStepPageViewModel);
    offerLoad$ = this._loadTargetedPurchaseDataIfNotAlreadyLoadedWorkflowService.build().pipe(
        suspensify(),
        tap(({ error }) => {
            if (error) {
                this._navigationPurchaseDataTargetedLoadResultsService.reRouteForNegativeScenario(error, this._activatedRoute.snapshot);
            }
        })
    );

    paymentFormInitialState$ = this.viewModel$.pipe(
        map(({ paymentInfo }) => paymentInfo),
        filter((paymentInfo) => !!paymentInfo),
        map((paymentInfo) => ({
            address: {
                addressLine1: paymentInfo?.serviceAddress?.addressLine1,
                city: paymentInfo?.serviceAddress?.city,
                state: paymentInfo?.serviceAddress?.state,
                zip: paymentInfo?.serviceAddress?.zip,
            },
            creditCard: paymentInfo?.creditCard,
            useCardOnFile: paymentInfo?.useCardOnFile,
        }))
    );

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _loadTargetedPurchaseDataIfNotAlreadyLoadedWorkflowService: LoadTargetedPurchaseDataIfNotAlreadyLoadedWorkflowService,
        private readonly _navigationPurchaseDataTargetedLoadResultsService: NavigationPurchaseDataTargetedLoadResultsService,
        private readonly _loadPurchaseReviewDataWorkflowService: LoadPurchaseReviewDataWorkflowService,
        private readonly _store: Store,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _router: Router,
        private readonly _location: Location,
        @Inject(DOCUMENT) private readonly _document: Document
    ) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {
        this.pageStepRouteConfiguration = GetPageStepRouteConfiguration(this._activatedRoute);
    }

    ngAfterViewInit() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'paymentinfo' }));
        if ((this._location?.getState() as any)?.ccError) {
            this._paymentInfoFormComponent?.showCreditCardSubmissionError();
        }
        if ((this._location?.getState() as any)?.systemError) {
            this._paymentInfoFormComponent?.showUnexpectedSubmissionError();
        }
    }

    private _scrollToTop() {
        this._document.body.scrollTop = 0;
    }

    onPaymentInfoCollected({ useCardOnFile, paymentInfo }: PaymentInfoData) {
        this._store.dispatch(collectPaymentInfo({ useCardOnFile, paymentInfo }));
        this._paymentInfoFormComponent.clearCreditCardSubmissionError();
        this._paymentInfoFormComponent.clearUnexpectedSubmissionError();
        this._loadPurchaseReviewDataWorkflowService.build().subscribe({
            next: () => {
                this._router.navigate([this.pageStepRouteConfiguration.routeUrlNext], { queryParamsHandling: 'preserve', relativeTo: this._activatedRoute });
                this.displayIneligibleLoader$.next(false);
                this._paymentInfoFormComponent.setProcessingCompleted();
            },
            error: () => {
                this._paymentInfoFormComponent.showUnexpectedSubmissionError();
                this.displayIneligibleLoader$.next(false);
                this._paymentInfoFormComponent.setProcessingCompleted();
            },
        });
    }

    onLoadingWithAlertMessageComplete($event: boolean) {
        if ($event) {
            this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Animation:notEligibleToPurchasePlan' }));
        }
    }
}
