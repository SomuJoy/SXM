import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import {
    AccountModel,
    ClosedDeviceModel,
    DataAccountService,
    DataIdentityRequestStoreService,
    IdentityRequestModel,
    PlanTypeEnum,
    RadioModel,
    SubscriptionModel,
} from '@de-care/data-services';
import { NonPiiLookupWorkflow } from '@de-care/data-workflows';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { BehaviorSubject } from 'rxjs';

export interface SharedYourInfoAccount {
    firstName: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    zipCode?: string;
}

interface SharedYourInfoTrParams {
    firstName: string;
    radioCount: number;
}

@Component({
    selector: 'your-info',
    templateUrl: './your-info.component.html',
    styleUrls: ['./your-info.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class YourInfoComponent implements OnInit, OnChanges {
    @Input()
    set subscriptions(subscriptions: SubscriptionModel[]) {
        const closed = [];
        const selfPaid = [];
        const notSelfPaid = [];

        subscriptions.forEach((subscription) => {
            if (subscription.status && subscription.status === 'Closed') {
                closed.push(subscription);
            } else {
                const plans = subscription.plans;
                if (plans) {
                    const plan = plans[0];
                    if (plan && plan.type === PlanTypeEnum.SelfPaid) {
                        selfPaid.push(subscription);
                    } else {
                        notSelfPaid.push(subscription);
                    }
                }
            }
            this.carInfoForRadios[subscription.radioService.last4DigitsOfRadioId] =
                !!subscription.radioService.vehicleInfo &&
                (!!subscription.radioService.vehicleInfo.make || !!subscription.radioService.vehicleInfo.model || !!subscription.radioService.vehicleInfo.year);
            this._dataAccount.sanitizeVehicleInfo(subscription.radioService.vehicleInfo);
        });
        this.subscriptionsFiltered = [
            ...closed,
            ...notSelfPaid.sort((subscription) => {
                return subscription.followonPlans && subscription.followonPlans.length > 0 ? 0 : -1;
            }),
            ...selfPaid,
        ];
        this._setRadiosCount();
    }
    @Input()
    closedRadios: ClosedDeviceModel[];
    @Input()
    isAccount: boolean = false;
    @Input()
    accountInfo: SharedYourInfoAccount;
    @Output()
    editYourInfo = new EventEmitter<void>();
    @Output()
    dontSeeYourRadio = new EventEmitter<void>();
    @Output()
    selectedRadio = new EventEmitter<RadioModel | ClosedDeviceModel>();
    @Output()
    selectedAccount = new EventEmitter<AccountModel & { last4DigitsOfAccountNumber?: string }>();

    commonTranslationParams$ = new BehaviorSubject<SharedYourInfoTrParams>({ firstName: '', radioCount: 0 });

    subscriptionsFiltered: SubscriptionModel[] = [];
    radiosCount = 0;
    firstName = '';
    carInfoForRadios: { [radioId: string]: boolean } = {};
    loading = false;
    accountNotSupportedError = false;
    isCanadaMode = false;

    constructor(
        private _dataAccount: DataAccountService,
        private _identityRequestStoreService: DataIdentityRequestStoreService,
        private _nonPiiSrv: NonPiiLookupWorkflow,
        private _changeDetectorRef: ChangeDetectorRef,
        private _userSettingsService: UserSettingsService,
        private _settingsService: SettingsService
    ) {}

    ngOnInit(): void {
        this.isCanadaMode = this._settingsService.isCanadaMode;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.closedRadios || changes.subscriptions) {
            this._setRadiosCount();
        }
        if (changes.accountInfo) {
            this.firstName = this.accountInfo && this.accountInfo.firstName;
            this.commonTranslationParams$.next({ firstName: this.firstName, radioCount: this.radiosCount });
        }
    }

    fireSelectedRadio(radio: RadioModel | ClosedDeviceModel) {
        this.accountNotSupportedError = false;
        const identityRequestData: IdentityRequestModel = this._identityRequestStoreService.getIdentityRequestData();
        identityRequestData.selectedRadio = radio.last4DigitsOfRadioId;
        this._identityRequestStoreService.setIdentityRequestData(identityRequestData);
        this.loading = true;
        this._nonPiiSrv.build({ radioId: radio.last4DigitsOfRadioId }).subscribe(
            (account) => {
                if (this.isCanadaMode) {
                    const state = account && account.serviceAddress && account.serviceAddress.state;
                    this._userSettingsService.setSelectedCanadianProvince(state);
                }
                this.selectedAccount.emit({ ...account, ...(identityRequestData.flepzInfo ? { lastName: identityRequestData.flepzInfo.lastName } : {}) });
                this.selectedRadio.emit(radio);
            },
            (error) => {
                if (error.error.error.errorCode === 'CUSTOMER_TYPE_NOT_SUPPORTED') {
                    this.accountNotSupportedError = true;
                }
                this.loading = false;
                this._changeDetectorRef.markForCheck();
            }
        );
    }

    fireDontSeeYourRadio($event: MouseEvent) {
        $event.preventDefault();
        this.dontSeeYourRadio.emit();
    }

    fireEditYourInfo() {
        this.editYourInfo.emit();
    }

    private _setRadiosCount(): void {
        this.radiosCount = (this.subscriptionsFiltered ? this.subscriptionsFiltered.length : 0) + (this.closedRadios ? this.closedRadios.length : 0);
        this.commonTranslationParams$.next({ firstName: this.firstName, radioCount: this.radiosCount });
    }
}
