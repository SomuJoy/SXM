import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { getCaseInsensitiveFromHttpParams, setCaseInsensitiveFromHttpParams } from '@de-care/browser-common';
import { FlepzWidgetOutgoingParams, FlepzWidgetParams } from '@de-care/data-services';
import { SharedVerifyDeviceUserSelection, Tabs } from '@de-care/identification';
import { TranslationOverrides } from '@de-care/app-common';
import { ElementsNavigationService } from '../elements-navigation.service';
import { ElementsSettings, ElementsSettingsToken } from '../elements-settings-token';
import { HttpParams } from '@angular/common/http';

@Component({
    selector: 'sxm-flepz-widget',
    template: `
        <verify-device-tabs
            [nflOptInEnabled]="enableNFLOptIn"
            [hideTabNav]="hideTabNav"
            [excludeInstructionsText]="true"
            [showHeadingText]="false"
            [tabsToShowOverride]="parsedTabsToShow"
            [translationOverrides]="parsedTranslationOverrides"
            [isPromoCodeValid]="isPromoCodeValid"
            [isOfferNotAvailable]="isOfferNotAvailable"
            (userSelection)="handleUserSelection($event)"
            (marketingPromoRedeemed)="handleMarketingPromoCode($event)"
        ></verify-device-tabs>
    `,
    styles: [
        `
            .text-link {
                font-weight: 400 !important;
            }

            a.text-link-secondary.no-underline {
                font-weight: 700 !important;
                text-decoration: none !important;
            }

            a.text-link-secondary.no-underline:before {
                height: 0;
            }

            .invalid-feedback p,
            .invalid-feedback a {
                color: $red;
                font-size: 0.85rem !important;
                font-weight: 700 !important;
                line-height: 1.5;
            }

            .invalid-feedback a:before {
                background: $red;
            }
        `,
    ],
    encapsulation: ViewEncapsulation.None,
})
export class FlepzWidgetComponent implements OnChanges, OnInit {
    // tslint:disable:no-input-rename
    @Input('extra-params') extraParams: string;
    @Input('tabs-to-show') tabsToShow: string;
    @Input('hide-tab-nav') hideTabNav = false;
    @Input('enable-nfl-opt-in') enableNFLOptIn = false;
    @Input('translation-overrides') translationOverrides: string;
    @Input('isPromoCodeValid') isPromoCodeValid = false;
    @Input('isOfferNotAvailable') isOfferNotAvailable = true;

    parsedTabsToShow: Tabs[];
    parsedTranslationOverrides: TranslationOverrides;

    private _paramsToForward: HttpParams = null;
    private _promoCode: string;

    constructor(private readonly _elementsNavigationService: ElementsNavigationService, @Inject(ElementsSettingsToken) private readonly _elementsSettings: ElementsSettings) {}

    ngOnInit(): void {
        const incomingParams = this._elementsNavigationService.getQueryParams();
        this._paramsToForward = new HttpParams();
        for (const key in FlepzWidgetParams) {
            if (FlepzWidgetParams[key]) {
                const value = getCaseInsensitiveFromHttpParams(key, incomingParams);
                if (value) {
                    this._paramsToForward = setCaseInsensitiveFromHttpParams(key, value, this._paramsToForward);
                }
            }
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.tabsToShow && changes.tabsToShow.currentValue !== changes.tabsToShow.previousValue) {
            this.parsedTabsToShow = this.tabsToShow.split(',') as Tabs[];
        }

        if (changes.translationOverrides && changes.translationOverrides.currentValue !== changes.translationOverrides.previousValue) {
            const overrideEval = new Function(`return ${this.translationOverrides}`);

            this.parsedTranslationOverrides = overrideEval();
        }
    }

    handleUserSelection(userSelectionData: SharedVerifyDeviceUserSelection): void {
        let outgoingParams: HttpParams = this._paramsToForward;
        if (this.extraParams) {
            const extraParams: HttpParams = new HttpParams({ fromString: this.extraParams });
            extraParams.keys().forEach((param) => {
                const value = extraParams.get(param);
                outgoingParams = setCaseInsensitiveFromHttpParams(param, value, outgoingParams);
            });
        }

        outgoingParams = setCaseInsensitiveFromHttpParams(FlepzWidgetOutgoingParams.lastName, userSelectionData.selectedAccount.lastName, outgoingParams);
        outgoingParams = setCaseInsensitiveFromHttpParams(FlepzWidgetOutgoingParams.radioId, userSelectionData.selectedRadio.last4DigitsOfRadioId, outgoingParams);
        outgoingParams = setCaseInsensitiveFromHttpParams(FlepzWidgetOutgoingParams.isIdentifiedUser, 'true', outgoingParams);

        if (this._promoCode) {
            outgoingParams = setCaseInsensitiveFromHttpParams(FlepzWidgetOutgoingParams.promoCode, this._promoCode, outgoingParams);
        }

        this._elementsNavigationService.onSuccessNavigateTo(this._elementsSettings.flepzSuccessUrl, outgoingParams.toString());
    }

    handleMarketingPromoCode(promoCode: string) {
        this._promoCode = promoCode;
    }
}
