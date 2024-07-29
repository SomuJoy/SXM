import { Inject, Injectable } from '@angular/core';
import { AmexStaticParams, AmexSdk, AmexSdkInitConfig, AmexSdkOfferRedeemedParams, AMEX_PARAMS } from '@de-care/shared/configuration-tokens-amex';
import { init, offerRedeemed, validateUser, getCampaignUuid } from '@kunaico/amex-perks-sdk';
import { Observable, Observer } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

const AMEX_SDK: AmexSdk = {
    init,
    validateUser,
    offerRedeemed,
    getCampaignUuid,
};

export type AmexError = {
    type: 'EMPTY_CAMPAIGN_UUID' | 'SYSTEM' | 'VALIDATION_ERROR' | 'REDEEM_ERROR';
    error: string | Error | Record<string, any> | null;
};
@Injectable({
    providedIn: 'root',
})
export class AmexService {
    constructor(@Inject(AMEX_PARAMS) private readonly _amexStaticParams: AmexStaticParams, @Inject(DOCUMENT) private document: Document) {}

    initAndValidateUser(config: Omit<AmexSdkInitConfig, 'mode' | 'campaignUuid' | 'merchantApiKey'>) {
        return new Observable((observer: Observer<Record<string, any>>) => {
            const campaignUuid = AMEX_SDK.getCampaignUuid();
            if (campaignUuid) {
                try {
                    AMEX_SDK.init({
                        ...config,
                        campaignUuid,
                        mode: this._amexStaticParams.mode,
                        merchantApiKey: this._amexStaticParams.merchantApiKey,
                    });
                    AMEX_SDK.validateUser()
                        .then((response) => {
                            observer.next(response);
                            observer.complete();
                        })
                        .catch((error) => {
                            observer.error({
                                type: 'VALIDATION_ERROR',
                                error: error,
                            } as AmexError);
                            observer.complete();
                        });
                } catch (e) {
                    observer.error({
                        type: 'SYSTEM',
                        error: e,
                    } as AmexError);
                    observer.complete();
                }
            } else {
                this.document.defaultView.location.href = this._amexStaticParams.authRedirectUrl;
                observer.error({
                    type: 'EMPTY_CAMPAIGN_UUID',
                    error: null,
                } as AmexError);
                observer.complete();
            }
        });
    }

    redeemOffer(params: AmexSdkOfferRedeemedParams, retries = 3) {
        return new Observable((observer: Observer<Record<string, any> | Error>) => {
            try {
                AMEX_SDK.offerRedeemed(params)
                    .then((response) => {
                        observer.next(response);
                        observer.complete();
                    })
                    .catch((e) => {
                        observer.error({
                            type: 'REDEEM_ERROR',
                            error: e,
                        } as AmexError);
                        observer.complete();
                    });
            } catch (e) {
                observer.error({
                    type: 'SYSTEM',
                    error: e,
                } as AmexError);
                observer.complete();
            }
        }).pipe(
            // for some reason retry is not working properly with out this wrapper
            catchError((error) => {
                throw error;
            }),
            retry(retries)
        );
    }
}
