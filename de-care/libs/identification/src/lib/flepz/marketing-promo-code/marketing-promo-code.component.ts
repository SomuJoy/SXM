import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, Inject } from '@angular/core';
import { getCaseInsensitiveQueryParam } from '@de-care/browser-common';
import { CoreLoggerService, SharedEventTrackService } from '@de-care/data-layer';
import { BehaviorSubject } from 'rxjs';
import { DataOfferService } from '@de-care/data-services';
import * as uuid from 'uuid/v4';

export interface MarketingPromoFormInfo {
    redeemSuccess: boolean;
    formExpand: boolean;
    promoCode: string;
    isPromoValid: boolean;
    isCanadaMode?: boolean;
}
/**
 * @deprecated
 */
@Component({
    selector: 'marketing-promo-code',
    templateUrl: './marketing-promo-code.component.html',
    styleUrls: ['./marketing-promo-code.component.scss'],
})
export class MarketingPromoCodeComponent implements OnInit, OnChanges {
    @Input() marketingPromoFormInfo: MarketingPromoFormInfo;
    @Input() isProgramCodeValid: boolean = true;
    @Input() isCanadaMode: boolean = false;
    @Output() marketingPromoRedeemed = new EventEmitter<MarketingPromoFormInfo>();
    @Output() marketingPromoCodeRemoved = new EventEmitter();

    private _logPrefix: string = '[Marketing Promo Code]:';
    private _promoCode: string;
    redeemSuccess: boolean = false;
    formExpand: boolean = false;
    trackRedeemOpenAction: string = 'promocode-opened';
    trackSubmitAction: string = 'promocode-redeemed';
    trackComponentName: string = 'promocode-redeem';
    redeemSuccessEmitter$ = new BehaviorSubject<boolean>(false);
    codeInUrl: boolean = false;
    promoCodeId: string;

    set promoCode(val: string) {
        this._promoCode = val;
        if (val === '') {
            this.promoCodeBlur();
        }
    }

    get promoCode() {
        return this._promoCode;
    }

    constructor(
        private _eventTrackingService: SharedEventTrackService,
        private _logger: CoreLoggerService,
        private _dataOfferSvc: DataOfferService,
        @Inject(DOCUMENT) private readonly _document: Document
    ) {
        this.promoCodeId = `promoCode_${uuid()}`;
    }

    ngOnInit() {
        this._logger.debug(`${this._logPrefix} Component running `);
        const promoCode = getCaseInsensitiveQueryParam(this._document.location.search, 'promocode');

        if (promoCode && this.marketingPromoFormInfo && this.marketingPromoFormInfo.isPromoValid && this.marketingPromoFormInfo.isCanadaMode) {
            this.codeInUrl = true;
            this.redeemSuccess = true;
            this.formExpand = true;
            this.promoCode = promoCode;
            this.redeemSuccessEmitter$.next(this.redeemSuccess);
        }
    }

    ngOnChanges() {
        if (this.marketingPromoFormInfo && !this.redeemSuccess) {
            this.redeemSuccess = this.marketingPromoFormInfo.redeemSuccess;
            this.formExpand = this.marketingPromoFormInfo.formExpand;
            this.promoCode = this.marketingPromoFormInfo.promoCode;
        }
    }

    submitPromoCode() {
        if (this.promoCode) {
            this._dataOfferSvc.validatePromoCode({ marketingPromoCode: this.promoCode }).subscribe(
                (data) => {
                    if (data.status === 'SUCCESS') {
                        this.redeemSuccess = true;
                        this.formExpand = true;
                        this.marketingPromoRedeemed.emit({
                            redeemSuccess: this.redeemSuccess,
                            formExpand: this.formExpand,
                            promoCode: this.promoCode,
                            isPromoValid: true,
                        });
                    } else {
                        this.redeemSuccess = null;
                    }
                    this.redeemSuccessEmitter$.next(this.redeemSuccess);
                },
                () => {
                    this.redeemSuccess = null;
                    this.redeemSuccessEmitter$.next(this.redeemSuccess);
                }
            );
        } else {
            this.redeemSuccess = null;
            this.redeemSuccessEmitter$.next(this.redeemSuccess);
        }

        this._eventTrackingService.track(this.trackSubmitAction, { componentName: this.trackComponentName, inputData: this.promoCode });
    }

    resetPromoCode() {
        this.promoCode = undefined;
        this.formExpand = false;
        this.removePromoCode();
        this.redeemSuccess = false;
        this.redeemSuccessEmitter$.next(this.redeemSuccess);
    }

    promoCodeBlur() {
        if (this.redeemSuccess === null && !this.promoCode) {
            this.removePromoCode();
            this.redeemSuccess = undefined;
        }
    }

    togglePromoCode() {
        if (this.redeemSuccess) {
            this.resetPromoCode();
        } else {
            this.formExpand = !this.formExpand;
            this.promoCode = undefined;

            if (this.formExpand) {
                this._eventTrackingService.track(this.trackRedeemOpenAction, { componentName: this.trackComponentName });
            }
        }
        this.redeemSuccess = false;
    }

    private removePromoCode() {
        this.marketingPromoCodeRemoved.emit();
    }
}
