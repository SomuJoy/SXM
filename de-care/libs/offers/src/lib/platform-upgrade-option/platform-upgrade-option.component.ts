import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { getPlatformFromPackageName, isOfferMCP, OfferDetailsModel, PackagePlatformEnum, PlanTypeEnum } from '@de-care/data-services';
import { OfferInfo } from '@de-care/domains/offers/ui-offer-description';
import { CURRENCY_PIPE_TWO_DECIMAL_NUMBER_FORMAT } from '@de-care/settings';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { pluck, startWith, takeUntil } from 'rxjs/operators';

export interface PlanDetails {
    type: PlanTypeEnum;
    packageName: string;
    termLength: number;
    pricePerMonth: number;
    retailPrice: number;
    price: number;
    savingsPercent?: number;
    processingFee?: number;
}

@Component({
    selector: 'app-platform-upgrade-option',
    templateUrl: './platform-upgrade-option.component.html',
    styleUrls: ['platform-upgrade-option.component.scss']
})
export class PlatformUpgradeOptionComponent implements OnInit, OnDestroy {
    @Input() set planDetails(planDetails: PlanDetails) {
        this.plan = planDetails;
        this.offerInfo = this._setOfferInfo(planDetails);
        this.offerDetails = this._setOfferDetails(planDetails);
        this.packageName = planDetails.packageName;
        this.platform = getPlatformFromPackageName(planDetails.packageName);
    }
    @Output() buyNow = new EventEmitter();
    @Output() keepSelect = new EventEmitter();

    plan: PlanDetails;
    offerInfo: OfferInfo;
    offerDetails: OfferDetailsModel;
    packageName: string;
    platform: PackagePlatformEnum;
    currentLang: string;
    priceFormat = CURRENCY_PIPE_TWO_DECIMAL_NUMBER_FORMAT;
    private _unsubscribe: Subject<void> = new Subject();

    constructor(private _translateService: TranslateService) {}

    ngOnInit() {
        this._listenForLang();
    }

    ngOnDestroy() {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private _setOfferInfo(planDetails: PlanDetails): OfferInfo {
        return {
            packageName: null, // Note: packageName set to null here so offer-description component won't display it (since it's displayed in this component)
            pricePerMonth: planDetails.pricePerMonth,
            retailPrice: planDetails.retailPrice,
            termLength: planDetails.termLength,
            price: planDetails.price,
            isMCP: isOfferMCP(planDetails.type),
            processingFee: planDetails.processingFee,
            type: planDetails.type
        };
    }

    private _setOfferDetails(planDetails: PlanDetails): OfferDetailsModel {
        return {
            name: planDetails.packageName,
            offerMonthlyRate: planDetails.pricePerMonth,
            retailRate: planDetails.retailPrice,
            offerTerm: planDetails.termLength,
            offerTotal: planDetails.price,
            isMCP: isOfferMCP(planDetails.type),
            processingFee: planDetails.processingFee,
            savingsPercent: planDetails.savingsPercent,
            type: planDetails.type
        };
    }

    private _listenForLang(): void {
        this._translateService.onLangChange
            .pipe(
                startWith({
                    lang: this._translateService.currentLang,
                    translations: null
                } as LangChangeEvent),
                pluck('lang'),
                takeUntil(this._unsubscribe)
            )
            .subscribe((lang: string) => (this.currentLang = lang));
    }
}
