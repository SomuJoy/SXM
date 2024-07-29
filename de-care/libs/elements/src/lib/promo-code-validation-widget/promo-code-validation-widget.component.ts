import { convertObjectToUrlQueryParamsString, getCaseInsensitiveFromHttpParams } from '@de-care/browser-common';
import { AfterViewInit, Component, Inject, Input, ViewChild } from '@angular/core';
import { ElementsNavigationService } from '../elements-navigation.service';
import { ElementsSettings, ElementsSettingsToken } from '../elements-settings-token';
import { HttpParams } from '@angular/common/http';
import { GetOfferTypeWorkflowService } from '@de-care/domains/offers/state-offers';
import { PromoCodeValidationComponentApi } from '@de-care/domains/offers/ui-promo-code-validation-form';

@Component({
    selector: 'sxm-promo-code-validation-widget',
    templateUrl: './promo-code-validation-widget.component.html',
    styleUrls: ['./promo-code-validation-widget.component.scss'],
})
export class PromoCodeValidationComponent implements AfterViewInit {
    private _langParam: string;
    private _queryParams: HttpParams;
    readonly translateKey = 'elements.promoCodeValidationComponent.';
    @ViewChild('promoCodeValidation') private _billingAddressComponent: PromoCodeValidationComponentApi;
    otherOffersUrl: string;
    @Input('is-streaming') isStreaming = true;
    constructor(
        private readonly _elementsNavigationService: ElementsNavigationService,
        @Inject(ElementsSettingsToken) private readonly _elementsSettings: ElementsSettings,
        private readonly getOfferTypeWorkflowService: GetOfferTypeWorkflowService
    ) {}

    ngAfterViewInit() {
        this._queryParams = this._elementsNavigationService.getQueryParams();
        this._langParam = getCaseInsensitiveFromHttpParams('langpref', this._queryParams);
    }

    onValidPromoCode(promoCode: string) {
        this.getOfferTypeWorkflowService
            .build({
                marketingPromoCode: promoCode,
                streaming: true,
            })
            .subscribe((offerType) => {
                const params = this._genParams({ promocode: promoCode });
                let url = this._elementsSettings.promocodeValidationBaseRedirectUrl;
                if (!offerType.includes('RTD')) {
                    url = this._elementsSettings.promocodeValidationBaseAccordionRedirectUrl;
                }
                this._elementsNavigationService.onSuccessNavigateTo(url, params);
                this._billingAddressComponent.setProcessingCompleted();
            });
    }

    onInValidPromoCode(promoCode: string) {
        const programCode = getCaseInsensitiveFromHttpParams('programcode', this._queryParams);
        this.otherOffersUrl = this._genOtherOffersUrl();
        this._billingAddressComponent.setProcessingCompleted();
    }

    private _genOtherOffersUrl() {
        const baseUrl = this._elementsSettings.promocodeValidationBaseAccordionRedirectUrl;
        const params = this._genParams();
        return this._elementsNavigationService.genUrl(baseUrl, params);
    }

    private _genParams(options?: { programcode?: string; promocode?: string; status?: string }) {
        return convertObjectToUrlQueryParamsString({
            ...(options?.programcode && { programCode: options.programcode }),
            ...(options?.promocode && { promocode: options.promocode }),
            ...(options?.status && { status: options.status }),
            ...(this._langParam && { langpref: this._langParam }),
        });
    }
}
