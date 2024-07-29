import { Component, Input } from '@angular/core';
import { OfferDetailsModel, OfferDetailsRTCModel } from '@de-care/data-services';
import { OfferDetailsTranslateService } from '../offer-details-translate.service';
import { OfferDetailsPickAPlanModel } from '@de-care/domains/offers/state-offers';
import { Subscription } from 'rxjs';

export interface AdditionalCopyOptions {
    showPriceChangeCopy: boolean;
    showLegalCopy: boolean;
}

@Component({
    selector: 'offer-details',
    templateUrl: './offer-details.component.html',
    styleUrls: ['./offer-details.component.scss'],
})
export class OfferDetailsComponent {
    @Input() set setPackageName(offer: string) {
        this._offerDetailsTranslateService.setSelectedOfferPlanName(offer);
    }

    @Input() set details(details: OfferDetailsModel) {
        !!details && this._offerDetailsTranslateService.setOfferDetails(details);
    }

    @Input() set rtcDetails(details: OfferDetailsRTCModel) {
        !!details && this._offerDetailsTranslateService.setRTCDetails(details);
    }

    @Input() set pickAPlanDetails(details: OfferDetailsPickAPlanModel) {
        !!details && this._offerDetailsTranslateService.setPickAPlanDetails(details);
    }

    @Input() set pickAPlan3FOR1PYPDetails(details: OfferDetailsPickAPlanModel) {
        !!details && this._offerDetailsTranslateService.setPickAPlan3FOR1PYPDetails(details);
    }

    @Input() copyOptions: AdditionalCopyOptions;

    @Input() set isACSC(isACSC: boolean) {
        this._offerDetailsTranslateService.setIsACSC(isACSC);
    }

    @Input() shouldDisplaySelectedOfferDetails = true;

    offerDetailsCopy$ = this._offerDetailsTranslateService.offerDetailsCopy$;
    legalCopy$ = this._offerDetailsTranslateService.legalCopy$;

    rtcFirstPartCopy$ = this._offerDetailsTranslateService.rtcFirstPartCopy$;
    rtcLastPartCopy$ = this._offerDetailsTranslateService.rtcLastPartCopy$;
    rtcRenewalPackagesCopy$ = this._offerDetailsTranslateService.rtcRenewalPackagesCopy$;
    pickAPlanFirstPartCopy$ = this._offerDetailsTranslateService.pickAPlanFirstPartCopy$;
    pickAPlanMiddlePartCopy$ = this._offerDetailsTranslateService.pickAPlanMiddlePartCopy$;
    pickAPlanPackagesCopy$ = this._offerDetailsTranslateService.pickAPlanPackagesCopy$;
    pickAPlanRenewalPackagesCopy$ = this._offerDetailsTranslateService.pickAPlanRenewalPackagesCopy$;
    pickAPlanLastPartCopy$ = this._offerDetailsTranslateService.pickAPlanLastPartCopy$;
    pickAPlan3FOR1PYPFirstPartCopy$ = this._offerDetailsTranslateService.pickAPlan3FOR1PYPFirstPartCopy$;
    pickAPlan3FOR1PYPMiddlePartCopy$ = this._offerDetailsTranslateService.pickAPlan3FOR1PYPMiddlePartCopy$;
    pickAPlan3FOR1PYPPackagesCopy$ = this._offerDetailsTranslateService.pickAPlan3FOR1PYPPackagesCopy$;
    pickAPlan3FOR1PYPRenewalPackagesCopy$ = this._offerDetailsTranslateService.pickAPlan3FOR1PYPRenewalPackagesCopy$;
    pickAPlan3FOR1PYPLastPartCopy$ = this._offerDetailsTranslateService.pickAPlan3FOR1PYPLastPartCopy$;
    offerDetailsType$ = this._offerDetailsTranslateService.offerDetailsType$;
    fullPriceCopy$ = this._offerDetailsTranslateService.fullPriceCopy$;

    private _pickSelectedPlanOfferHTMLSubscription: Subscription;
    pickSelectedPlanOfferHTML$ = this._offerDetailsTranslateService.selectedPlanOffer$;
    hasSelectedOffer = false;

    constructor(private _offerDetailsTranslateService: OfferDetailsTranslateService) {}

    ngAfterViewInit() {
        this._pickSelectedPlanOfferHTMLSubscription = this.pickSelectedPlanOfferHTML$.subscribe(
            (offer) => (this.hasSelectedOffer = offer && this.shouldDisplaySelectedOfferDetails ? true : false)
        );
    }

    ngOnDestroy() {
        this._pickSelectedPlanOfferHTMLSubscription.unsubscribe();
    }
}
