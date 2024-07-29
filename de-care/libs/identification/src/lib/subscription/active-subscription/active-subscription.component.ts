import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { PlanTypeEnum, sanitizeVehicleInfo, SubscriptionModel, SubscriptionStatusEnum, VehicleModel, PlanModel } from '@de-care/data-services';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { behaviorEventErrorFromBusinessLogic } from '@de-care/shared/state-behavior-events';

export interface ActiveSubscriptionInfo {
    subscription: SubscriptionModel;
    flepzData?: FlepzData;
    isSignedIn?: boolean;
}

interface SubscriptionInfo {
    vehicle?: VehicleModel;
    radioId: string;
    plans: PlanModel[];
    maskedUserName: string;
}

interface FlepzData {
    firstName: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    zipCode?: string;
}

@Component({
    selector: 'active-subscription',
    templateUrl: './active-subscription.component.html',
    styleUrls: ['./active-subscription.component.scss']
})
export class ActiveSubscriptionComponent implements OnInit, OnDestroy {
    @Input() set activeSubscriptionInfo(value: ActiveSubscriptionInfo) {
        if (value) {
            this.flepzData = value.flepzData;
            this._checkForSubscription(value.subscription);
            this.isSignedIn = value.isSignedIn;
        } else {
            this.flepzData = null;
            this.subscriptionInfo = null;
            this.hasVehicle = false;
            this.streaming = false;
        }
    }
    @Output() loginRequested = new EventEmitter();
    @Output() manageAccountRequested = new EventEmitter();
    @Output() lookupNewRadioRequested = new EventEmitter();
    @Output() editAccountInfoRequested = new EventEmitter();
    locale: string;
    dateFormat$: Observable<string>;
    timeZone: string;
    subscriptionInfo: SubscriptionInfo;
    flepzData: FlepzData;
    hasVehicle = false;
    trialPlanType = PlanTypeEnum.Trial;
    selfPaidPlanType = PlanTypeEnum.SelfPaid;
    streaming = false;
    streamingUrlPart = '';
    isSignedIn = false;

    private _unsubscribe: Subject<void> = new Subject();
    constructor(
        private _translateService: TranslateService,
        private userSettingsService: UserSettingsService,
        private _settingsService: SettingsService,
        private _store: Store
    ) {
        this.dateFormat$ = userSettingsService.dateFormat$;
        this.locale = _translateService.currentLang;
    }

    ngOnInit() {
        this._translateService.onLangChange.pipe(takeUntil(this._unsubscribe)).subscribe((changes: LangChangeEvent) => {
            this.locale = changes.lang;
        });
        if (this._settingsService.isCanadaMode) {
            this.userSettingsService.isQuebec$.pipe(takeUntil(this._unsubscribe)).subscribe(isQuebec => {
                this.streamingUrlPart = isQuebec ? '_QUEBEC' : '';
            });
        }
    }

    private _checkForSubscription(subscription: SubscriptionModel): void {
        if (!subscription) {
            this.subscriptionInfo = null;
            this.hasVehicle = false;
        } else {
            this._setSubscriptionInfo(subscription);
        }
    }

    private _checkSubscriptionPlan(plan: PlanModel): void {
        if (!plan) {
            throw new Error('No subscription plan in data for Active Subscription modal.');
        }
    }

    // TODO: do we really want to be dispatching the same error for each follow on plan in array
    //       or do we only want to dispatch 1 error if there are any follow on plans?
    private _checkSubscriptionAndFollowOnPlan(followOnPlan): void {
        if (this.subscriptionInfo && followOnPlan) {
            this._store.dispatch(behaviorEventErrorFromBusinessLogic({ message: 'Paid subscriber' }));
        }
    }

    private _setSubscriptionInfo(subscription: SubscriptionModel) {
        this.streaming = !subscription.radioService && subscription.streamingService && subscription.streamingService.status === SubscriptionStatusEnum.ACTIVE;
        const vehicleInfo = subscription.radioService && subscription.radioService.vehicleInfo ? subscription.radioService.vehicleInfo : null;

        for (const plan of subscription.plans) {
            this._checkSubscriptionPlan(plan);
        }

        if (subscription && subscription.followonPlans) {
            for (const followOnPlan of subscription.followonPlans) {
                this._checkSubscriptionAndFollowOnPlan(followOnPlan);
            }
        }

        const plans = subscription.plans.map(plan => {
            if (plan.type !== this.trialPlanType) {
                return plan;
            } else {
                const planIndex = subscription.plans.indexOf(plan);
                if (subscription && subscription.followonPlans) {
                    return subscription.followonPlans[planIndex] && subscription.followonPlans[planIndex].type === this.selfPaidPlanType
                        ? subscription.followonPlans[planIndex]
                        : plan;
                }
            }
        });

        const vehicle = vehicleInfo
            ? {
                  year: vehicleInfo.year,
                  make: vehicleInfo.make,
                  model: vehicleInfo.model
              }
            : null;

        const radioId = subscription.radioService && subscription.radioService.last4DigitsOfRadioId ? subscription.radioService.last4DigitsOfRadioId : null;
        const maskedUserName =
            subscription && subscription.streamingService && subscription.streamingService.maskedUserName ? subscription.streamingService.maskedUserName : null;

        this.subscriptionInfo = {
            vehicle,
            radioId,
            plans,
            maskedUserName
        };

        this.hasVehicle = !!vehicleInfo && (!!vehicleInfo.make || !!vehicleInfo.model || !!vehicleInfo.year);
        sanitizeVehicleInfo(this.subscriptionInfo.vehicle);
    }

    ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }
}
