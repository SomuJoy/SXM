import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    captureUserSelectedSecondDevice,
    DeviceType,
    getAddSecondDevicesFirstStepData,
    getAddSecondDevicesOrderSummary,
    getIsStreaming,
    getRequireValidateUserRadioModal,
    getSelectedStreamingAccount,
    LoadAddSecondRadioReviewDataWorkflowService,
    PurchaseVipForAddSecondRadioWorkflowService,
    PurchaseVipForAddStreamingWorkflowService,
} from '@de-care/de-care-use-cases/checkout/state-upgrade-vip';
import { behaviorEventImpressionForComponent, behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import { SxmUiAccordionStepperComponent } from '@de-care/shared/sxm-ui/ui-accordion-stepper';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { first, map } from 'rxjs/operators';
import { SecondRadioLookupComponent } from '../../components/second-radio-lookup/second-radio-lookup.component';
@Component({
    templateUrl: './add-second-radio-page.component.html',
    styleUrls: ['./add-second-radio-page.component.scss'],
    selector: 'de-care-add-second-radio-page',
})
export class AddSecondRadioPageComponent implements AfterViewInit {
    translateKeyPrefix = 'DeCareUseCasesCheckoutFeatureUpgradeVipModule.AddSecondRadioPageComponent.';
    @ViewChild('secondRadioLookupComponent', { static: false }) _secondRadioLookupComponent: SecondRadioLookupComponent;

    firstStepData$ = this._store.select(getAddSecondDevicesFirstStepData);
    selectedStreaming$ = this._store.select(getSelectedStreamingAccount);
    isStreaming$ = this._store.select(getIsStreaming);
    orderSummary$ = this._store.select(getAddSecondDevicesOrderSummary);
    currentLang$ = this._translateService.onLangChange.pipe(map((ev) => ev.lang));

    secondStepLoading = false;

    reviewStepLoading = false;

    requireValidateUserRadioModal$ = this._store.select(getRequireValidateUserRadioModal);

    @ViewChild('stepper') private readonly _stepper: SxmUiAccordionStepperComponent;
    constructor(
        private readonly _store: Store,
        private readonly _router: Router,
        private readonly _loadAddSecondRadioReviewDataWorkflowService: LoadAddSecondRadioReviewDataWorkflowService,
        private readonly _purchaseVipForAddSecondRadioWorkflowService: PurchaseVipForAddSecondRadioWorkflowService,
        private readonly _purchaseVipForAddStreamingWorkflowService: PurchaseVipForAddStreamingWorkflowService,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _translateService: TranslateService
    ) {}

    ngAfterViewInit() {
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'PVIPADDRADIO', componentKey: 'selectsecondradio' }));
    }

    onFirstStepEdited() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'selectsecondradio' }));
    }

    onReviewStepActive() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'review' }));
    }

    onAddSecondaryStepContinue(subscription: DeviceType) {
        this.secondStepLoading = true;
        this._loadAddSecondRadioReviewDataWorkflowService.build(subscription).subscribe(() => {
            this.secondStepLoading = false;
            this._stepper.next();
        });
    }

    onAddSecondRadioButton() {
        this.reviewStepLoading = true;
        this.isStreaming$.pipe(first()).subscribe((isStreaming) => {
            if (isStreaming) {
                this._purchaseVipForAddStreamingWorkflowService.build().subscribe(async () => {
                    await this._router.navigate(['thanks'], { relativeTo: this._activatedRoute, replaceUrl: true });
                    this.reviewStepLoading = false;
                });
            } else {
                this._purchaseVipForAddSecondRadioWorkflowService.build().subscribe(async () => {
                    await this._router.navigate(['thanks'], { relativeTo: this._activatedRoute, replaceUrl: true });
                    this.reviewStepLoading = false;
                });
            }
        });
    }

    openSearchModal() {
        this._secondRadioLookupComponent.openSearchModal();
    }
}
