import { Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { IdentityLookupPhoneOrEmailResponseModel, VehicleModel, sanitizeVehicleInfo, Plan, SubscriptionActionTypeEnum } from '@de-care/data-services';
import { Observable, Subject } from 'rxjs';
import { UserSettingsService } from '@de-care/settings';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'subscription-item',
    templateUrl: './subscription-item.component.html',
    styleUrls: ['./subscription-item.component.scss'],
})
export class SubscriptionItemComponent implements OnInit, OnDestroy {
    basePlane: Plan;

    @Input() set subscription(subscription: IdentityLookupPhoneOrEmailResponseModel) {
        if (subscription) {
            this.sub = subscription;
            this._displayUsernameOrVehicleOrRadioId();
            this.basePlane = this.getBasePlan(subscription);
        }
    }
    @Output() actionClicked = new EventEmitter<IdentityLookupPhoneOrEmailResponseModel>();
    subscriptionActionTypeEnum = SubscriptionActionTypeEnum;
    sub: IdentityLookupPhoneOrEmailResponseModel;
    dateFormat$: Observable<string>;
    timezone;
    locale: string;
    vehicleInfo: VehicleModel;
    maskedUserName: string;
    radioIdLast4: string;
    streamingPlayerLink: string;
    private _unsubscribe: Subject<void> = new Subject();

    constructor(private _userSettingsService: UserSettingsService, private _translateService: TranslateService) {}

    ngOnInit() {
        this.dateFormat$ = this._userSettingsService.dateFormat$;
        this.locale = this._translateService.currentLang;
        this.timezone = null;
        this._listenForLangChange();
    }

    ngOnDestroy() {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private _listenForLangChange(): void {
        this._translateService.onLangChange.pipe(takeUntil(this._unsubscribe)).subscribe((changes: LangChangeEvent) => {
            this.locale = changes.lang;
        });
    }

    private _displayUsernameOrVehicleOrRadioId(): void {
        this.maskedUserName = null;
        this.vehicleInfo = null;
        this.radioIdLast4 = null;
        this.streamingPlayerLink = 'identification.subscriptionItemComponent.STREAMING_PLAYER_LINK.SATELLITE_OFFER';
        if (this.sub?.streamingService?.maskedUserName) {
            this.maskedUserName = this.sub.streamingService.maskedUserName;
        } else if (this.sub?.radioService?.vehicleInfo) {
            const vehicle = this.sub.radioService.vehicleInfo;
            sanitizeVehicleInfo(vehicle);
            this.vehicleInfo = vehicle;
        } else if (this.sub?.radioService?.last4DigitsOfRadioId) {
            this.radioIdLast4 = this.sub.radioService.last4DigitsOfRadioId;
        }
    }

    private getBasePlan(sub: IdentityLookupPhoneOrEmailResponseModel): Plan {
        let plan = sub.plans[0];
        for (let i = 0; i < sub.plans?.length; i++) {
            if (sub.plans[i].capabilities && sub.plans[i].capabilities.find((c) => c === 'AUD')) {
                plan = sub.plans[i];
                break;
            }
        }
        return plan;
    }
}
