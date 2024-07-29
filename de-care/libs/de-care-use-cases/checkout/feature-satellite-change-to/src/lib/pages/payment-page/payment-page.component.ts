import { CommonModule, Location } from '@angular/common';
import { Component, ChangeDetectionStrategy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeCareSharedUiPageLayoutModule } from '@de-care/de-care-shared-ui-page-layout';
import { collectPaymentInfo, getPaymentPageViewModel, LoadChangeToReviewDataWorkflowService } from '@de-care/de-care-use-cases/checkout/state-satellite-change-to';
import {
    DeCareUseCasesCheckoutUiCommonModule,
    PaymentInfoUseCardNewAddressData,
    PaymentInfoUseCardNewAddressFormComponent,
    PaymentInfoUseCardNewAddressFormComponentApi,
    PaymentInfoUseCardNewAddressFormComponentModule,
} from '@de-care/de-care-use-cases/checkout/ui-common';
import { SharedSxmUiUiPrimaryPackageCardModule } from '@de-care/shared/sxm-ui/ui-primary-package-card';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { SxmUiVehicleYmmInfoWithEditCtaComponentModule } from '@de-care/shared/sxm-ui/ui-vehicle-ymm-info';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { ReactiveComponentModule } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../routes/page-step-route-configuration';
import { SharedSxmUiUiToastNotificationModule } from '@de-care/shared/sxm-ui/ui-toast-notification';

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
    standalone: true,
    imports: [
        TranslateModule,
        ReactiveComponentModule,
        DeCareSharedUiPageLayoutModule,
        SharedSxmUiUiStepperModule,
        SharedSxmUiUiPrimaryPackageCardModule,
        PaymentInfoUseCardNewAddressFormComponentModule,
        CommonModule,
        SharedSxmUiUiToastNotificationModule,
        DeCareUseCasesCheckoutUiCommonModule,
        SxmUiVehicleYmmInfoWithEditCtaComponentModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentPageComponent implements ComponentWithLocale, AfterViewInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    viewModel$ = this._store.select(getPaymentPageViewModel);
    pageStepRouteConfiguration: PageStepRouteConfiguration;
    @ViewChild(PaymentInfoUseCardNewAddressFormComponent) private readonly _paymentInfoUseCardNewAddressFormComponent: PaymentInfoUseCardNewAddressFormComponentApi;

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _store: Store,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _router: Router,
        private readonly _location: Location,
        private readonly _loadChangeToReviewDataWorkflowService: LoadChangeToReviewDataWorkflowService
    ) {
        translationsForComponentService.init(this);
        this.pageStepRouteConfiguration = GetPageStepRouteConfiguration(this._activatedRoute);
    }

    ngAfterViewInit(): void {
        if ((this._location?.getState() as any)?.ccError) {
            this._paymentInfoUseCardNewAddressFormComponent?.showCreditCardSubmissionError();
        }
        if ((this._location?.getState() as any)?.systemError) {
            this._paymentInfoUseCardNewAddressFormComponent?.showUnexpectedSubmissionError();
        }
    }
    onPaymentInfoCollected({ useCardOnFile, paymentInfo }: PaymentInfoUseCardNewAddressData) {
        this._store.dispatch(collectPaymentInfo({ useCardOnFile, paymentInfo }));
        this._loadChangeToReviewDataWorkflowService.build().subscribe({
            next: () => {
                this._paymentInfoUseCardNewAddressFormComponent.setProcessingCompleted();
                this._router.navigate([this.pageStepRouteConfiguration.routeUrlNext], { relativeTo: this._activatedRoute });
            },
            error: () => {
                // TODO: show system error message on this page
                this._paymentInfoUseCardNewAddressFormComponent.setProcessingCompleted();
            },
        });
    }

    redirectToSelectOrLookUpPage(useSelectYourRadioUrlForDeviceEdituse) {
        useSelectYourRadioUrlForDeviceEdituse
            ? this._router.navigate([this.pageStepRouteConfiguration.startOfFlowUrl], { relativeTo: this._activatedRoute })
            : this._router.navigate([this.pageStepRouteConfiguration.lookupDeviceUrl], { relativeTo: this._activatedRoute });
    }
}
