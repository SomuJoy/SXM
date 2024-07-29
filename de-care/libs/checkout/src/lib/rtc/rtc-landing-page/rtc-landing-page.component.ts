import { Store, select } from '@ngrx/store';
import { AfterViewInit, Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { DataLayerService } from '@de-care/data-layer';
import {
    ComponentNameEnum,
    DataLayerDataTypeEnum,
    FlowNameEnum,
    PackageModel,
    getActivePlansOnAccount,
    getMrdDiscount,
    OfferDetailsRTCModel,
    OfferDetailsModel
} from '@de-care/data-services';
import { FollowOnPlanSelectionData, PlanComparisonGridParams, RetailPriceAndMrdEligibility } from '@de-care/offers';
import { HeroTitleTypeEnum } from '@de-care/domains/offers/ui-hero';
import { TranslateService } from '@ngx-translate/core';
import { Observable, combineLatest, of } from 'rxjs';
import { map, tap, withLatestFrom, switchMap } from 'rxjs/operators';
import { RtcResolverData } from '../../rtc.resolver';
import { RtcLandingPageService } from './rtc-landing-page.service';
import { AdditionalCopyOptions } from '@de-care/sales-common';
import { getShowChoiceNotAvailableError } from '@de-care/checkout-state';

@Component({
    selector: 'rtc-landing-page',
    templateUrl: './rtc-landing-page.component.html',
    styleUrls: ['./rtc-landing-page.component.scss'],
    providers: [RtcLandingPageService]
})
export class RtcLandingPageComponent implements OnInit, AfterViewInit {
    accountNumber: string;
    heroTitleType = HeroTitleTypeEnum.Renewal;
    leadOffer: PackageModel;
    packageDescriptionName: string;
    packageNames: string[];
    planSelectionData$: Observable<{
        rtcData: RtcResolverData;
        followOnPlanSelectionData: FollowOnPlanSelectionData;
        planComparisonGridParams: PlanComparisonGridParams;
    }>;
    programCode: string;
    radioId: string;
    retailPrices: RetailPriceAndMrdEligibility[];
    selectedPackageIndex = 2;
    offerDetailsCopyOptions: AdditionalCopyOptions = {
        showLegalCopy: false,
        showPriceChangeCopy: false
    };
    rtcOfferDetails: OfferDetailsRTCModel;
    offerDetails: OfferDetailsModel;
    containsChoicePackages: boolean;
    showChoiceNotAvailableError$ = this._store.pipe(select(getShowChoiceNotAvailableError));

    @HostBinding('attr.data-e2e')
    dataE2E = 'rtcLandingPage';

    constructor(
        private _dataLayerService: DataLayerService,
        private _route: ActivatedRoute,
        public rtcLandingPageService: RtcLandingPageService,
        private _translateService: TranslateService,
        private _store: Store
    ) {}

    ngOnInit() {
        this.rtcLandingPageService.notLoading();

        this.planSelectionData$ = this._route.data.pipe(
            map<Data, RtcResolverData>(data => {
                return data.rtcData;
            }),
            tap(rtcData => {
                this.accountNumber = rtcData.accountNumber;
                this.leadOffer = rtcData.leadOffer;
                this.packageDescriptionName = this._translateService.instant(`app.packageDescriptions.${this.leadOffer.packageName}.name`);
                this.packageNames = rtcData.renewalOptions.map(offer => offer.parentPackageName || offer.packageName);
                this.programCode = rtcData.programCode;
                this.radioId = rtcData.radioId;
                this.retailPrices = rtcData.renewalOptions.map(offer => ({ pricePerMonth: offer.pricePerMonth, mrdEligible: offer.mrdEligible }));

                this.rtcLandingPageService.selectRenewalOffer(this.accountNumber, rtcData.leadOffer.packageName);
                this.containsChoicePackages = rtcData.containsChoicePackages;
            }),
            withLatestFrom(this.rtcLandingPageService.selectedRenewalOfferPackageName$, this.rtcLandingPageService.account$),
            map(([rtcData, selectedRenewalOfferPackageName, account]) => {
                const accountPlans = getActivePlansOnAccount(account);
                const trialEndDate = accountPlans && accountPlans[0].endDate;
                const selectedPackage = rtcData.renewalOptions.find(offer => offer.packageName === selectedRenewalOfferPackageName);
                const familyDiscount = getMrdDiscount(selectedPackage);
                const followOnPlanSelectionData = {
                    packages: rtcData.renewalOptions,
                    selectedPackageName: selectedRenewalOfferPackageName,
                    leadOfferEndDate: rtcData.leadOffer.planEndDate,
                    leadOfferPackageName: rtcData.leadOffer.packageName
                } as FollowOnPlanSelectionData;
                const planComparisonGridParams = {
                    selectedPackageName: selectedRenewalOfferPackageName,
                    familyDiscount,
                    leadOfferPackageName: rtcData.leadOffer.packageName,
                    leadOfferTerm: rtcData.leadOffer.termLength,
                    trialEndDate
                } as PlanComparisonGridParams;
                this.rtcOfferDetails = {
                    renewalPackages: rtcData.renewalOptions.map(pkg => ({
                        packageName: pkg.packageName,
                        pricePerMonth: pkg.pricePerMonth,
                        msrpPrice: pkg.msrpPrice,
                        mrdEligible: pkg.mrdEligible,
                        parentPackageName: pkg.parentPackageName
                    })),
                    selectedPackage: selectedRenewalOfferPackageName
                };
                this.offerDetails = rtcData.offerDetails;
                return {
                    rtcData,
                    followOnPlanSelectionData,
                    planComparisonGridParams
                };
            }),
            switchMap(data => combineLatest([of(data), this.rtcLandingPageService.selectedRenewalOfferPackageName$])),
            map(([data, selectedRenewalPackageName]) => {
                if (data.planComparisonGridParams.selectedPackageName !== selectedRenewalPackageName) {
                    const selectedPackage = data.rtcData.renewalOptions.find(offer => offer.packageName === selectedRenewalPackageName);
                    const familyDiscount = getMrdDiscount(selectedPackage);
                    data.planComparisonGridParams = {
                        ...data.planComparisonGridParams,
                        selectedPackageName: selectedRenewalPackageName,
                        familyDiscount
                    };
                }
                return data;
            })
        );
    }

    ngAfterViewInit(): void {
        this._dataLayerService.updateAndSendPageTrackEvent(DataLayerDataTypeEnum.PageInfo, ComponentNameEnum.RtcLandingPage, {
            flowName: FlowNameEnum.Checkout,
            componentName: ComponentNameEnum.RtcLandingPage
        });
    }

    handleSelectedPackageIndex($event) {
        this.selectedPackageIndex = $event;
    }
}
