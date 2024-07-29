import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { selectOfferInfosForCurrentLocaleMappedByPlanCode } from '@de-care/domains/offers/state-offers-info';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, Observable, combineLatest, Subscription } from 'rxjs';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { PackageModel, DataLayerDataTypeEnum, FlowNameEnum } from '@de-care/data-services';
import { distinctUntilChanged, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { BillingAddress } from '../../data-models/billing-address';
import { PaymentInfo } from '../../data-models/payment-info';
import { DataLayerService } from '@de-care/data-layer';
import { OemStepComponent } from '../../page-parts/oem-step/oem-step.component';
import { Account } from '../../data-models/account';
import { getQuote, LoadQuoteWorkflowService } from '@de-care/domains/quotes/state-quote';

export interface OemFlowState {
    isClosedRadio: boolean;
    selectedOffer: PackageModel;
    paymentInfo: PaymentInfo;
    billingAddress: BillingAddress;
    radioIdLastFour: string;
    programCode: string;
    quote;
    submitPaymentInfoError: boolean;
    hasActiveSubscription: boolean;
    account: Account;
    legalCopy?: any;
}

@Injectable()
export class OemFlowStateService {
    private _initialState: OemFlowState = {
        isClosedRadio: false,
        selectedOffer: null,
        paymentInfo: null,
        billingAddress: null,
        radioIdLastFour: null,
        programCode: null,
        quote: null,
        submitPaymentInfoError: false,
        hasActiveSubscription: false,
        account: null,
        legalCopy: null,
    };

    private _state: OemFlowState = this._initialState;
    private _store$ = new BehaviorSubject<OemFlowState>(this._initialState);
    private _subscription: Subscription;

    isClosedRadio$ = this._store$.pipe(
        map((state) => state.isClosedRadio),
        distinctUntilChanged()
    );
    selectedOffer$ = this._store$.pipe(
        map((state) => state.selectedOffer),
        distinctUntilChanged()
    );

    paymentInfo$ = this._store$.pipe(
        map((state) => state.paymentInfo),
        distinctUntilChanged()
    );
    billingAddress$ = this._store$.pipe(
        map((state) => state.billingAddress),
        distinctUntilChanged()
    );
    radioIdLastFour$ = this._store$.pipe(
        map((state) => state.radioIdLastFour),
        distinctUntilChanged()
    );
    programCode$ = this._store$.pipe(
        map((state) => state.programCode),
        distinctUntilChanged()
    );
    quote$ = this._store$.pipe(
        map((state) => state.quote),
        distinctUntilChanged()
    );
    submitPaymentInfoError$ = this._store$.pipe(
        map((state) => state.submitPaymentInfoError),
        distinctUntilChanged()
    );
    hasActiveSubscription$ = this._store$.pipe(
        map((state) => state.hasActiveSubscription),
        distinctUntilChanged()
    );
    account$ = this._store$.pipe(
        map((state) => state.account),
        distinctUntilChanged()
    );
    private _offersInfoForSelectedPlanCode$ = combineLatest([
        this._ngrxStore.pipe(select(selectOfferInfosForCurrentLocaleMappedByPlanCode)),
        this.selectedOffer$.pipe(map(({ planCode }) => planCode)),
    ]).pipe(map(([offerInfos, planCode]) => offerInfos[planCode] || null));
    private _legalCopy$ = this._offersInfoForSelectedPlanCode$.pipe(map((offerInfo) => offerInfo?.offerDetails));

    vm$: Observable<OemFlowState> = combineLatest([
        this.isClosedRadio$,
        this.selectedOffer$,
        this.paymentInfo$,
        this.billingAddress$,
        this.radioIdLastFour$,
        this.programCode$,
        this.quote$,
        this.submitPaymentInfoError$,
        this.hasActiveSubscription$,
        this.account$,
        this._legalCopy$,
    ]).pipe(
        map(
            ([
                isClosedRadio,
                selectedOffer,
                paymentInfo,
                billingAddress,
                radioIdLastFour,
                programCode,
                quote,
                submitPaymentInfoError,
                hasActiveSubscription,
                account,
                legalCopy,
            ]) => {
                return {
                    isClosedRadio,
                    selectedOffer,
                    paymentInfo,
                    billingAddress,
                    radioIdLastFour,
                    programCode,
                    quote,
                    submitPaymentInfoError,
                    hasActiveSubscription,
                    account,
                    legalCopy,
                };
            }
        )
    );

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _titleService: Title,
        private _dataLayerService: DataLayerService,
        private readonly _ngrxStore: Store,
        private readonly _loadQuoteWorkflowService: LoadQuoteWorkflowService
    ) {}

    init(): void {
        this._subscription = this.selectedOffer$
            .pipe(
                filter((offer) => offer !== null),
                withLatestFrom(this.radioIdLastFour$),
                switchMap(([offer, radioIdLastFour]) => this._loadQuoteWorkflowService.build({ planCodes: [offer.planCode], radioId: radioIdLastFour })),
                withLatestFrom(this._ngrxStore.select(getQuote)),
                map(([, quote]) => quote)
            )
            .subscribe((quote) => {
                this.updateStateData({ quote });
            });
    }

    unsubscribe(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    setStep(step: OemStepComponent, selectedIndex: number) {
        this._updatePageTitle(step.label);
        this._updateQueryParam(selectedIndex);

        if (step.dataLayerTitle) {
            const componentName: string = step.dataLayerTitle;
            this._dataLayerService.updateAndSendPageTrackEvent(DataLayerDataTypeEnum.PageInfo, componentName, { flowName: FlowNameEnum.Oem, componentName: componentName });
        }
    }

    handleSelectionChange(selectionChangeEvent: StepperSelectionEvent) {
        this.setStep(selectionChangeEvent.selectedStep as OemStepComponent, selectionChangeEvent.selectedIndex);
    }

    updateStateData(data) {
        this._updateState({ ...this._state, ...data });
    }

    clearStateData() {
        this.updateStateData({ ...this._initialState });
    }

    private _updatePageTitle(pageTitle: string) {
        this._titleService.setTitle(`SiriusXM - ${pageTitle}`);
    }

    private _updateQueryParam(stepIndex: number) {
        this._router.navigate([], {
            relativeTo: this._activatedRoute,
            queryParams: {
                step: stepIndex,
            },
            queryParamsHandling: 'merge',
        });
    }

    private _updateState(state: OemFlowState) {
        this._store$.next((this._state = state));
    }
}
