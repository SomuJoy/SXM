import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { PaymentInfoData, PaymentInfoFormComponent, PaymentInfoFormComponentApi } from '@de-care/de-care-use-cases/checkout/ui-common';
import { BehaviorSubject } from 'rxjs';
import { CommonModule, DOCUMENT, Location } from '@angular/common';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';
import { SxmUiVehicleYmmInfoComponentModule } from '@de-care/shared/sxm-ui/ui-vehicle-ymm-info';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { SharedSxmUiUiPrimaryPackageCardModule } from '@de-care/shared/sxm-ui/ui-primary-package-card';
import { SharedSxmUiUiLoadingWithAlertMessageModule } from '@de-care/shared/sxm-ui/ui-loading-with-alert-message';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../routes/page-step-route-configuration';
import { collectPaymentInfo, getPaymentPageViewModel, LoadPurchaseReviewDataWorkflowService } from '@de-care/de-care-use-cases/checkout/state-add-radio-router';
import { ReactiveComponentModule } from '@ngrx/component';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-payment-page',
    templateUrl: './payment-page.component.html',
    styleUrls: ['./payment-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveComponentModule,
        SxmUiVehicleYmmInfoComponentModule,
        SharedSxmUiUiStepperModule,
        SharedSxmUiUiPrimaryPackageCardModule,
        PaymentInfoFormComponent,
        SharedSxmUiUiLoadingWithAlertMessageModule,
    ],
})
export class PaymentPageComponent implements ComponentWithLocale, OnInit, AfterViewInit {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    pageStepRouteConfiguration: PageStepRouteConfiguration;
    @ViewChild(PaymentInfoFormComponent) private readonly _paymentInfoFormComponent: PaymentInfoFormComponentApi;
    displayIneligibleLoader$ = new BehaviorSubject(false);
    viewModel$ = this._store.select(getPaymentPageViewModel);

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
