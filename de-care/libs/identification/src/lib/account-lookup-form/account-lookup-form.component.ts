import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import {
    ComponentNameEnum,
    DataLayerActionEnum,
    DataLayerDataTypeEnum,
    FlowNameEnum,
    IdentityLookupPhoneOrEmailResponseModel,
    SubscriptionActionTypeEnum
} from '@de-care/data-services';
import { AccountLookupComponent, AccountLookupComponentApi, AccountLookupOutput } from '../lookup/account-lookup/account-lookup.component';
import { SharedEventTrackService, DataLayerService } from '@de-care/data-layer';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { EMPTY, of } from 'rxjs';
import { concatMap, switchMap, take, tap } from 'rxjs/operators';

import { ValidateLpzFormComponent } from '../lookup/validate-lpz-form/validate-lpz-form.component';
import { StreamingEligibleSubscription } from '../streaming/your-subscriptions/your-subscriptions.component';
import { AccountLookupFormStateService } from './account-lookup-form-state.service';
import { NonPiiLookupWorkflow } from '@de-care/data-workflows';
import * as uuid from 'uuid/v4';

export enum StepCompleteReasonEnum {
    EmailAccountFoundCreateLogin = 'Email Account Found - Create Login',
    EmailAccountFoundSignIn = 'Email Account Found - Sign In',
    EmailAccountNotFound = 'Email Account NOT Found',
    EmailAccountsFoundModalClosed = 'Email Account Found - Modal Closed without Selection',
    EmailAccountFoundAddSubscription = 'Email Account Found - Add Subscription',
    StudentValidTokenAddSubscription = 'Student Valid Token - Add Subscription'
}

export interface AccountLookupStepComplete extends AccountLookupOutput {
    completeReason: null | StepCompleteReasonEnum;
    selectedSubscription: IdentityLookupPhoneOrEmailResponseModel;
}

export const clearLpzFormAndLoading = (lpzFormComponent: ValidateLpzFormComponent) => {
    lpzFormComponent.clearForm();
    lpzFormComponent.loading = false;
};

export interface AccountLookupFormComponentApi {
    doLookup(email: string): void;
}

@Component({
    selector: 'account-lookup-form',
    templateUrl: './account-lookup-form.component.html',
    styleUrls: ['./account-lookup-form.component.css'],
    providers: [AccountLookupFormStateService]
})
export class AccountLookupFormComponent implements OnChanges, AfterViewInit, AccountLookupFormComponentApi {
    subscriptions: StreamingEligibleSubscription[];
    private _checkSubscriptions: boolean = false;
    private _checkOneSubscription: boolean = false;
    private _accountIsValidated: boolean = true;

    subscriptionCount: number;

    @Input()
    email: string;

    @Input()
    closeVerifyAccountModal: boolean;

    @Input()
    isActiveStudentAccount: boolean = false;

    @Output()
    stepComplete: EventEmitter<AccountLookupStepComplete> = new EventEmitter<AccountLookupStepComplete>();
    @Output() subscribeLinkClicked = new EventEmitter<boolean>();
    @Output() accountLoadedForSubscription = new EventEmitter<any>();

    @ViewChild('accountFoundModal') private _accountFoundModal: SxmUiModalComponent;
    @ViewChild('verifyAccountModal') private _verifyAccountModal: SxmUiModalComponent;
    @ViewChild('lpzForm') private _lpzFormComponent: ValidateLpzFormComponent;
    @ViewChild(AccountLookupComponent) accountLookupComponent: AccountLookupComponentApi;

    accountLookupyourSubsModalAriaDescribedbyTextId = uuid();
    accountLookupModalAriaDescribedbyTextId = uuid();

    constructor(
        public accountLookupState: AccountLookupFormStateService,
        private _eventTrackingService: SharedEventTrackService,
        private _dataLayerSrv: DataLayerService,
        private _nonPiiSrv: NonPiiLookupWorkflow
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.closeVerifyAccountModal && !!changes.closeVerifyAccountModal.currentValue) {
            clearLpzFormAndLoading(this._lpzFormComponent);
            this._verifyAccountModal.close();
        }
    }

    ngAfterViewInit(): void {
        if (this.isActiveStudentAccount) {
            this.onActiveStudentAccount();
        }
    }

    doLookup(email: string): void {
        this.accountLookupComponent.doLookup(email);
    }

    onContinue(payload: AccountLookupOutput): void {
        this.accountLookupState.updateStateData({
            attemptedEmail: payload.attemptedEmail || '',
            emailValid: payload.emailValid || false,
            accountData: payload.accountData || []
        });
        if (payload.accountData) {
            this.subscriptionCount = (
                payload.accountData.filter(item => item.streamingService && item.streamingService.status === 'Active' && !item.streamingService.randomCredentials) || []
            ).length;
        }
        this.email = payload.attemptedEmail;
        this.accountLookupState.hasQualifyingSubscriptions$
            .pipe(
                take(1),
                switchMap(result => {
                    this._checkSubscriptions = result;
                    return this.accountLookupState.hasOneOfferedSubscription$.pipe(take(1));
                }),
                concatMap(result => {
                    this._checkOneSubscription = result;
                    if (this._checkSubscriptions && this._checkOneSubscription) {
                        return this.accountLookupState.streamingSubscriptions$.pipe(
                            take(1),
                            concatMap(subscriptions => {
                                this.accountLookupState.updateStateData({
                                    selectedSubscription: subscriptions.offeredSubscriptions[0]
                                });
                                this.onAccountSubscription(subscriptions.offeredSubscriptions[0].id);
                                return of(EMPTY);
                            })
                        );
                    }
                    if (!this._checkSubscriptions && !this._checkOneSubscription) {
                        this.onAccountNotFound();
                    }
                    if (this._checkSubscriptions && !this._checkOneSubscription) {
                        this.onAccountFound();
                    }
                    return of(EMPTY);
                })
            )
            .subscribe();
    }

    onAccountFound(): void {
        const componentName: ComponentNameEnum = ComponentNameEnum.SignIn;
        this._accountFoundModal.open();
        this._dataLayerSrv.updateAndSendPageTrackEvent(DataLayerDataTypeEnum.PageInfo, componentName, {
            flowName: FlowNameEnum.Authenticate,
            componentName: componentName,
            subscriptionCount: this.subscriptionCount
        });
        // "subscribeLinkClicked" gets passed to payment-info.component,
        // If true, it'll notify Analytics
        this.subscribeLinkClicked.emit(true);
    }

    onAccountNotFound(): void {
        this.accountLookupState.updateStateData({ completeReason: StepCompleteReasonEnum.EmailAccountNotFound });
        this.exitStep();
    }

    onAccountFoundModalClose(): void {
        this.accountLookupState.updateStateData({ completeReason: StepCompleteReasonEnum.EmailAccountsFoundModalClosed });
        this.exitStep();
    }

    onAccountSubscription(subscriptionId: string): void {
        this.accountLookupState.updateStateData({ completeReason: StepCompleteReasonEnum.EmailAccountFoundAddSubscription });
        this._accountFoundModal.close();
        this._eventTrackingService.track('signin-clicked', { componentName: ComponentNameEnum.SignIn });
        this._accountIsValidated = false;
        this.exitStep();
        this._nonPiiSrv
            .build({
                subscriptionId
            })
            .pipe(tap(account => this.accountLoadedForSubscription.emit({ payload: account })))
            .subscribe(() => {
                this._verifyAccountModal.open();
            });
    }

    onSubscriptionAction(subscription: IdentityLookupPhoneOrEmailResponseModel) {
        this.accountLookupState.updateStateData({
            selectedSubscription: subscription
        });
        switch (subscription.subActionType) {
            case SubscriptionActionTypeEnum.SIGN_IN:
                this.accountLookupState.updateStateData({ completeReason: StepCompleteReasonEnum.EmailAccountFoundSignIn });
                this._accountFoundModal.close();
                this.exitStep();
                return;
            case SubscriptionActionTypeEnum.CREATE_LOGIN:
                this.accountLookupState.updateStateData({ completeReason: StepCompleteReasonEnum.EmailAccountFoundCreateLogin });
                this._accountFoundModal.close();
                this._accountIsValidated = false;
                this._verifyAccountModal.open();
                return;
            case SubscriptionActionTypeEnum.ADD_SUB:
                this._eventTrackingService.track(DataLayerActionEnum.SubscribeLink, { componentName: ComponentNameEnum.AccountLookup });
                this.onAccountSubscription(subscription.id);
                return;
        }
    }

    onVerifyAccountModalClose(): void {
        clearLpzFormAndLoading(this._lpzFormComponent);
        this.exitStep();
    }

    backToAccountFound() {
        this._verifyAccountModal.close();
        this.onAccountFound();
    }

    onAccountVerified(): void {
        this._accountIsValidated = true;
        this.exitStep();
    }

    onAccountInvalid(): void {
        this._accountIsValidated = false;
    }

    onActiveStudentAccount(): void {
        this.accountLookupState.updateStateData({ completeReason: StepCompleteReasonEnum.StudentValidTokenAddSubscription });
        this._accountIsValidated = false;
        this._verifyAccountModal.open();
    }

    exitStep(): void {
        if (this._accountIsValidated) {
            this.accountLookupState.stepInfo$.pipe(take(1)).subscribe(stepInfo => {
                this.stepComplete.emit(stepInfo);
            });
        }
    }
}