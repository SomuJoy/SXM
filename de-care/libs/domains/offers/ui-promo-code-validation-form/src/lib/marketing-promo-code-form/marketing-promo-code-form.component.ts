import { Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { ValidatePromoCodeWorkflowService } from '@de-care/domains/offers/state-promo-code';
import { catchError, tap } from 'rxjs/operators';
import * as uuid from 'uuid/v4';

export interface MarketingPromoFormInfo {
    redeemSuccess: boolean;
    formExpand: boolean;
    promoCode: string;
    isPromoValid: boolean;
}

export interface MarketingPromoCodeFormComponentApi {
    setProcessingCompleted: () => void;
    setProcessingError: () => void;
}

@Component({
    selector: 'marketing-promo-code-form',
    templateUrl: './marketing-promo-code-form.component.html',
    styleUrls: ['./marketing-promo-code-form.component.scss'],
})
export class MarketingPromoCodeFormComponent implements OnInit, OnChanges, AfterViewInit {
    @Input() marketingPromoFormInfo: MarketingPromoFormInfo;
    @Input() isProgramCodeValid: boolean = true;
    @Input() promoCodeToPrefill;
    @Output() marketingPromoRedeemed = new EventEmitter<string>();
    @Output() marketingPromoCodeRemoved = new EventEmitter();

    private _promoCode: string;
    loading$ = new BehaviorSubject<boolean>(false);
    redeemSuccess: boolean = false;
    redeemError = false;
    formExpand: boolean = false;
    codeInUrl: boolean = false;
    promoCodeId: string;

    readonly translateKey = 'domainsOffersUiPromoCodeValidationFormModule.promoCodeValidationFormComponent.';
    set promoCode(val: string) {
        this._promoCode = val;
        if (val === '') {
            this.promoCodeBlur();
        }
    }

    get promoCode() {
        return this._promoCode;
    }

    constructor(private readonly _store: Store, private readonly _validatePromoCodeWorkflowService: ValidatePromoCodeWorkflowService) {
        this.promoCodeId = `promoCode_${uuid()}`;
    }

    ngOnInit() {
        if (this.promoCodeToPrefill && this.marketingPromoFormInfo && this.marketingPromoFormInfo.isPromoValid) {
            this.codeInUrl = true;
            this.redeemSuccess = true;
            this.formExpand = true;
            this.promoCode = this.promoCodeToPrefill;
        }
    }

    ngOnChanges() {
        if (this.marketingPromoFormInfo && !this.redeemSuccess) {
            this.redeemSuccess = this.marketingPromoFormInfo.redeemSuccess;
            this.formExpand = this.marketingPromoFormInfo.formExpand;
            this.promoCode = this.marketingPromoFormInfo.promoCode;
        }
    }

    ngAfterViewInit() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'promocode-redeem' }));
    }

    submitPromoCode() {
        if (this.promoCode) {
            this.loading$.next(true);
            this._validatePromoCodeWorkflowService
                .build({
                    marketingPromoCode: this.promoCode,
                    streaming: false,
                })
                .pipe(
                    tap((data) => {
                        if (data?.status === 'VALID') {
                            this.formExpand = true;
                            this.marketingPromoRedeemed.emit(this.promoCode);
                        } else {
                            this.loading$.next(false);
                            this.redeemSuccess = false;
                            this.redeemError = true;
                        }
                        // we want the parent component to explicity says when the loading finishes on success
                    })
                )
                .subscribe();
        } else {
            this.redeemSuccess = null;
        }
    }

    resetPromoCode() {
        this.promoCode = undefined;
        this.formExpand = false;
        this.removePromoCode();
        this.redeemSuccess = false;
    }

    promoCodeBlur() {
        if (this.redeemSuccess === false && !this.promoCode) {
            this.redeemError = false;
            this.removePromoCode();
        }
    }

    promoCodeChange() {
        this.redeemError = false;
    }

    togglePromoCode() {
        if (this.redeemSuccess) {
            this.resetPromoCode();
        } else {
            this.formExpand = !this.formExpand;
            this.promoCode = undefined;
        }
        this.redeemSuccess = false;
        this.redeemError = false;
    }

    setProcessingError() {
        this.loading$.next(false);
        this.redeemSuccess = false;
        this.redeemError = true;
    }

    setProcessingCompleted() {
        this.redeemSuccess = true;
        this.loading$.next(false);
    }

    private removePromoCode() {
        this.marketingPromoCodeRemoved.emit();
    }
}
