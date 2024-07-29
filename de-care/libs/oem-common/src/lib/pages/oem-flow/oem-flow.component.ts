import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, noop } from 'rxjs';
import { map, mergeMap, take, filter } from 'rxjs/operators';
import { OemFlowState, OemFlowStateService } from './oem-flow-state.service';
import { CdkStepper, CdkStep, StepperSelectionEvent } from '@angular/cdk/stepper';
import { OemFlowStepSubmission } from './oem-flow-step-submission';
import { ActivatedRoute } from '@angular/router';
import { BillingAddress } from '../../data-models/billing-address';
import { PaymentInfo } from '../../data-models/payment-info';
import { OemFlowService, SubmitOrderPayload, SubmitStatus } from '../../oem-flow.service';
import { ComponentNameEnum, FlowNameEnum, DataLayerDataTypeEnum } from '@de-care/data-services';
import { DataLayerService } from '@de-care/data-layer';
import { OemStepComponent } from '../../page-parts/oem-step/oem-step.component';
import { SummaryStepComponent, SummaryStepComponentApi } from '../../page-parts/summary-step/summary-step.component';
import { SettingsService } from '@de-care/settings';

@Component({
    selector: 'oem-flow',
    templateUrl: './oem-flow.component.html',
    styleUrls: ['./oem-flow.component.scss'],
    providers: [OemFlowStateService]
})
export class OemFlowComponent implements AfterViewInit, OnInit, OnDestroy {
    vm$: Observable<OemFlowState> = this._oemFlowStateService.vm$;

    @ViewChild('stepper') stepper: CdkStepper;
    @ViewChild('paymentInfoStep') paymentInfoStep: CdkStep;
    @ViewChild('confirmationStep') confirmationStep: CdkStep;
    @ViewChild(SummaryStepComponent) _summaryStep: SummaryStepComponentApi;

    componentNameEnum = ComponentNameEnum;
    account$ = this._oemFlowStateService.account$;
    includeCvvField = false;

    constructor(
        private _oemFlowStateService: OemFlowStateService,
        private _oemFlowService: OemFlowService,
        private _activatedRoute: ActivatedRoute,
        private _dataLayerService: DataLayerService,
        private _settingsService: SettingsService
    ) {}

    ngOnInit() {
        this._oemFlowStateService.init();
        this._oemFlowStateService.updateStateData({ ...this._activatedRoute.snapshot.data.oemFlowRouteData });
        this.includeCvvField = this._settingsService.isCVVEnabled;
    }

    ngAfterViewInit() {
        this._activatedRoute.queryParamMap.subscribe(paramsMap => {
            // TODO: Add logic here to determine if sale has been complete and if so need to redirect to entry
            let stepIndex = +paramsMap.get('step');
            if (stepIndex >= this.stepper.steps.length) {
                stepIndex = 0;
            }
            this.stepper.selectedIndex = stepIndex;
            this._checkSubmitStatus();
        });
        this._oemFlowStateService.setStep(this.stepper.steps.first as OemStepComponent, 0);
    }

    handlePaymentInfo(paymentInfo: PaymentInfo) {
        this.onSubmission({ paymentInfo });
    }

    handleBillingAddress(billingAddress: BillingAddress) {
        this.stepper.next();
        this._oemFlowStateService.updateStateData({ billingAddress: billingAddress });
    }

    handleSummary(): void {
        this._oemFlowStateService.vm$
            .pipe(
                take(1),
                map<OemFlowState, SubmitOrderPayload>(vm => ({
                    radioIdLastFour: vm.radioIdLastFour,
                    isClosedRadio: vm.isClosedRadio,
                    billingAddress: vm.billingAddress,
                    paymentInfo: vm.paymentInfo,
                    planCode: vm.selectedOffer.planCode
                })),
                mergeMap(submitOrderPayload => this._oemFlowService.submitOrder(submitOrderPayload))
            )
            .subscribe(submitResult => {
                this._summaryStep.resetProcessingFlag();
                switch (submitResult.status) {
                    case SubmitStatus.SUCCESS: {
                        this._oemFlowStateService.clearStateData();
                        this._oemFlowStateService.updateStateData({ hasActiveSubscription: true });
                        this.stepper.next();
                        break;
                    }
                    case SubmitStatus.PAYMENT_ERROR: {
                        this._oemFlowStateService.updateStateData({ submitPaymentInfoError: true });
                        this.stepper.selectedIndex = this.stepper.steps.toArray().indexOf(this.paymentInfoStep);
                        break;
                    }
                    case SubmitStatus.GENERAL_ERROR:
                    default: {
                        this._oemFlowService.goToErrorPage();
                        const componentName: string = ComponentNameEnum.OemErrorPage;
                        this._dataLayerService.updateAndSendPageTrackEvent(DataLayerDataTypeEnum.PageInfo, ComponentNameEnum.OemErrorPage, {
                            flowName: FlowNameEnum.Oem,
                            componentName: componentName
                        });
                        break;
                    }
                }
            });
    }

    onSelectionChange(selectionChangeEvent: StepperSelectionEvent) {
        this._oemFlowStateService.handleSelectionChange(selectionChangeEvent);
    }

    onSubmission(submittedValue: OemFlowStepSubmission) {
        this.stepper.next();
        if (submittedValue) {
            this._oemFlowStateService.updateStateData(submittedValue);
        }
    }

    onDone(): void {
        window.close();
    }

    ngOnDestroy(): void {
        this._oemFlowStateService.unsubscribe();
    }

    private _checkSubmitStatus(): void {
        this._oemFlowStateService.hasActiveSubscription$
            .pipe(
                filter(hasActiveSubscription => hasActiveSubscription && this.stepper.selectedIndex !== this.stepper.steps.toArray().indexOf(this.confirmationStep)),
                take(1)
            )
            .subscribe(() => this._oemFlowService.goToAccountPage());
    }
}
