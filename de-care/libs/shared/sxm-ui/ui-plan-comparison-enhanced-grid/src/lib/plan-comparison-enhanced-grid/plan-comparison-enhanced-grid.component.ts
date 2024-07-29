import { CommonModule, formatCurrency } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy, Input, EventEmitter, Output, OnDestroy, OnInit } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiWithoutPlatformNamePipeModule, WithoutPlatformNamePipe } from '@de-care/shared/sxm-ui/ui-without-platform-name-pipe';
import { Observable, Subject, BehaviorSubject, zip } from 'rxjs';
import { map, switchMap, flatMap, takeUntil, startWith } from 'rxjs/operators';
import { SharedSxmUiUiAccordionChevronModule } from '@de-care/shared/sxm-ui/ui-accordion-chevron';
import { mapPackageNameToListenOn, CURRENCY_PIPE_OPTIONAL_DECIMAL_NUMBER_FORMAT, CURRENCY_PIPE_TWO_DECIMAL_NUMBER_FORMAT } from './helpers';

interface GridRowColumnModel {
    label?: string;
    checkmark?: boolean;
    linkUrl?: string;
}

interface GridRowViewModel {
    title: string;
    tooltip?: string;
    tooltipId?: string;
    columns: GridRowColumnModel[];
    dataE2e?: string;
}

interface PlanComparisonGridParams {
    leadOfferTerm: number;
    trialEndDate?: string;
    familyDiscount?: number;
    selectedPackageName: string;
    leadOfferPackageName: string;
}

interface PlanComparisonGridParamsInternal {
    features: FeatureModel[];
    channelLineUpURLs: string[];
    selectedPackageIndex: number;
    selectedPackageName: string;
    selectedName: string;
    names: string[];
}

//feature is essentially a grid row
interface FeatureModel {
    name: string;
    tooltipText?: string;
    checkMarks: boolean[];
    counts: any;
    columns: any[];
}

export interface RetailPriceAndMrdEligibility {
    msrpPrice: number;
    pricePerMonth: number;
    mrdEligible: boolean;
    termLength?: number;
    retailPrice?: number;
    type?: string;
    price?: number;
}

export interface OfferData {
    msrpPrice?: number;
    pricePerMonth: number;
    mrdEligible: boolean;
    isPromo?: boolean;
    price?: number;
    termLength?: number;
    retailPrice?: number;
    type?: string;
}

export interface AdditionalGridRowModel extends GridRowViewModel {
    customSelectedIndex?: number;
}

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-plan-comparison-enhanced-grid',
    templateUrl: './plan-comparison-enhanced-grid.component.html',
    styleUrls: ['./plan-comparison-enhanced-grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiPlanComparisonEnhancedGridComponent implements ComponentWithLocale, OnInit, OnDestroy {
    selectedIndex = 0;
    constructor(readonly translationsForComponentService: TranslationsForComponentService, private _withoutPlatformNamePipe: WithoutPlatformNamePipe) {
        translationsForComponentService.init(this);
    }

    @Input() withOutFees = false;
    @Output() continue = new EventEmitter<void>();
    @Output() packageIndexSelected = new EventEmitter<number>();
    @Input() displayCallsToAction = true;

    @Input() set packageNames(packageNames: string[]) {
        // Observable stream for pkg names
        this._packageNames$.next(packageNames);
        this.numPlans = packageNames.length;
    }

    @Input() additionalGridRows: any[];

    @Input() set planComparisonGridParams(params: PlanComparisonGridParams) {
        this._setEndDate(params.leadOfferTerm, params.trialEndDate);
        this.selectedPackageName = params.selectedPackageName;
        this.leadOfferPackageName = params.leadOfferPackageName;
        this.familyDiscount = params.familyDiscount;
    }

    @Input()
    set retailPrices(retailPrices: RetailPriceAndMrdEligibility[]) {
        this.retailPricesData = retailPrices;
        this.updateRenewalPriceRowColumnsData();
    }

    @Input()
    set offersData(offersData: OfferData[]) {
        this.offerData = offersData;
        this.updatePriceRowsColumnsData();
    }
    @Input() set selectedPackageIndex(index: number) {
        this.selectedIndex = index;
        this._selectedPackageIndex.next(index);
    }
    @Input() isProactive: boolean;
    @Input() overwriteTfn: string;
    @Input()
    get questionsPhoneNumber(): string {
        return this._questionsPhoneNumber;
    }
    set questionsPhoneNumber(tfn: string) {
        this._questionsPhoneNumber = tfn?.trim();
    }
    private _questionsPhoneNumber: string;
    @Input()
    get continueButtonText(): string {
        return this._continueButtonText;
    }
    set continueButtonText(buttonText: string) {
        this._continueButtonText = buttonText?.trim();
    }
    private _continueButtonText: string;
    @Input() activateExpandable = false;
    @Input() hasWhereToListenRow = false;
    @Input() featuresIndex: number = null; // index of the package to use to create feature rows
    selectedPackageType = '';

    dateFormat$: Observable<string>;
    leadOfferPackageName: string;
    familyDiscount: number;
    selectedPackageName: string;
    priceFormat = CURRENCY_PIPE_OPTIONAL_DECIMAL_NUMBER_FORMAT;
    currentLang: string;
    endDate: Date;
    tfnType: string;
    numPlans: number;
    whereToListenColumns: GridRowColumnModel[];
    renewalPriceRowColumnsData: GridRowColumnModel[];
    monthlyPriceRowColumnsData: GridRowColumnModel[];
    promoPriceRowColumnsData: GridRowColumnModel[];
    whatYouGetRowColumnsData: GridRowColumnModel[];
    channelLineupRowColumnsData: GridRowColumnModel[];
    offerData: OfferData[];
    retailPricesData: RetailPriceAndMrdEligibility[];
    isOfferTypeIsPromoOrPromoMCP = false;
    languageResources: LanguageResources;
    translateKeyPrefix: string;

    private readonly destroy$ = new Subject<boolean>();

    private _packageNames$ = new BehaviorSubject([]);
    private readonly _selectedPackageIndex = new BehaviorSubject<number>(null);
    parameters$: Observable<PlanComparisonGridParamsInternal> = this._packageNames$.pipe(
        switchMap((packageNames) => {
            // Aggregate together all observable streams for each package
            return zip(...this._getTranslationsStreams(packageNames));
        }),
        flatMap((packages) =>
            this._selectedPackageIndex.pipe(
                map((selectedPackageIndex) => ({
                    packages,
                    selectedPackageIndex,
                }))
            )
        ),
        map(({ packages, selectedPackageIndex }) => {
            if (selectedPackageIndex >= 0) {
                this.selectedPackageType = this._getPackageName(packages[selectedPackageIndex].packageName);
            }
            // returns the index with the bigger number of features
            const pkgLenghtArray = packages.map((pkg) => pkg?.features?.length);
            const maxFeatLenght = pkgLenghtArray?.reduce((a, b) => (b > a ? b : a), 0);
            const maxFeatLenghtIndex = 0 || pkgLenghtArray?.indexOf(maxFeatLenght);

            const featuresIndex = this.featuresIndex === null ? maxFeatLenghtIndex : this.featuresIndex;
            const features = packages[featuresIndex]?.features?.map((featureObj) => {
                const checkMarks = packages.map(
                    (packageOption) =>
                        !!packageOption.features?.find((o) => {
                            return o.name === featureObj.name;
                        })
                );
                const counts = packages.map((packageOption) => {
                    // First, check to see if feature exists in the package
                    const featureIndex = packageOption.features?.findIndex((o) => o.name === featureObj.name);
                    // If it exists, return the value for count
                    return featureIndex > -1 && packageOption.features[featureIndex].count ? packageOption.features[featureIndex].count : null;
                });
                const columns = packages.map((packageOption, i) => ({
                    label: counts[i],
                    checkmark: checkMarks[i],
                }));
                return {
                    name: featureObj.name,
                    // Return true if the current feature being iterated over is included in the package
                    checkMarks,
                    tooltipText: featureObj.tooltipText && featureObj.tooltipText,
                    counts,
                    columns,
                };
            });
            const names = packages.map((i) => i.name);
            this.channelLineupRowColumnsData = packages.map((plan) => ({
                label: plan.channelLineUpURL ? this.translationsForComponentService.instant(this.translateKeyPrefix + '.VIEW_LINEUP') : '',
                linkUrl: plan.channelLineUpURL,
            }));
            this.whatYouGetRowColumnsData = packages.map((_package) => {
                const packageName = this._getPackageName(_package.packageName)?.replace(/&/g, '')?.replace(/ +/g, '_')?.toUpperCase();
                return {
                    label: this.translationsForComponentService.instant(this.translateKeyPrefix + `.${packageName}_WHAT_YOU_GET`),
                };
            });
            this.whereToListenColumns = packages.map((_package) => {
                let key: string;
                const { insideTheCar, outsideTheCar } = mapPackageNameToListenOn(_package.packageName);
                if (insideTheCar && outsideTheCar) {
                    key = '.BOTH_APP_AND_CAR';
                } else if (insideTheCar) {
                    key = '.CAR_ONLY';
                } else {
                    key = '.APP_ONLY';
                }
                return {
                    label: this.translationsForComponentService.instant(this.translateKeyPrefix + key),
                };
            });
            return {
                features,
                channelLineUpURLs: packages.map((i) => i.channelLineUpURL),
                names,
                selectedPackageIndex,
                selectedName: names[selectedPackageIndex],
                selectedPackageName: packages[selectedPackageIndex]?.packageName,
            };
        })
    );

    ngOnInit() {
        this.tfnType = this.isProactive ? 'PROACTIVE' : 'REACTIVE';
        this.currentLang = this.translationsForComponentService.currentLang;
        this.translationsForComponentService.currentLang$.pipe(takeUntil(this.destroy$)).subscribe((lang) => {
            this.currentLang = lang;
            this.updatePriceRowsColumnsData();
            this.updateRenewalPriceRowColumnsData();
        });
    }

    private updateRenewalPriceRowColumnsData(): void {
        if (this.retailPricesData) {
            const lang = this.currentLang ? this.currentLang : this.translationsForComponentService.currentLang;
            this.renewalPriceRowColumnsData = this.retailPricesData.map((price) => {
                if (price.type === 'PROMO_MCP') {
                    this.isOfferTypeIsPromoOrPromoMCP = true;
                    return {
                        label: this.translationsForComponentService.instant(this.translateKeyPrefix + '.PROMO_MCP_PYP_PRICE', {
                            price: price.pricePerMonth,
                            termLength: price.termLength,
                            retailPrice: price.retailPrice,
                        }),
                    };
                } else if (price.type === 'PROMO') {
                    this.isOfferTypeIsPromoOrPromoMCP = true;
                    return {
                        label: this.translationsForComponentService.instant(this.translateKeyPrefix + '.PROMO_PYP_PRICE', {
                            price: price.price,
                            termLength: price.termLength,
                            retailPrice: price.retailPrice,
                        }),
                    };
                }
                return {
                    label:
                        formatCurrency(price.pricePerMonth, lang, '$', 'USD', CURRENCY_PIPE_TWO_DECIMAL_NUMBER_FORMAT).toString() +
                        (this.familyDiscount && price.mrdEligible ? '*' : ''),
                };
            });
        }
    }

    private updatePriceRowsColumnsData(): void {
        if (this.offerData) {
            const lang = this.currentLang ? this.currentLang : this.translationsForComponentService.currentLang;
            const containsPromoPlan = this.offerData.slice(1).filter((o) => o.isPromo).length > 0;
            const quebecKey = this.withOutFees ? 'WITH_OUT_FEES' : '';
            if (containsPromoPlan) {
                this.promoPriceRowColumnsData = this.offerData.map((price) => ({
                    label: price.isPromo
                        ? this.translationsForComponentService.instant(
                              this.translateKeyPrefix + '.MONTHLY_PRICE_PROMO' + (price.type === 'PROMO_MCP' ? '_MCP' : '') + quebecKey,
                              {
                                  price: price.price,
                                  termLength: price.termLength,
                                  msrpPrice: price.msrpPrice,
                              }
                          )
                        : '-',
                }));
                this._setEndDate(this.offerData[1]?.termLength);
                this.monthlyPriceRowColumnsData = this.offerData.map((price) => ({
                    label:
                        formatCurrency(price.retailPrice, lang, '$', 'USD', CURRENCY_PIPE_TWO_DECIMAL_NUMBER_FORMAT).toString() +
                        this.translationsForComponentService.instant(this.translateKeyPrefix + '.PER_MONTH' + quebecKey) +
                        (this.familyDiscount && price.mrdEligible ? '*' : ''),
                }));
            } else {
                this.monthlyPriceRowColumnsData = this.offerData.map((price) => ({
                    label:
                        price.pricePerMonth && price.type === 'SELF_PAID'
                            ? formatCurrency(price.pricePerMonth, lang, '$', 'USD', CURRENCY_PIPE_TWO_DECIMAL_NUMBER_FORMAT).toString() +
                              this.translationsForComponentService.instant(this.translateKeyPrefix + '.PER_MONTH' + quebecKey) +
                              (this.familyDiscount && price.mrdEligible ? '*' : '')
                            : '-',
                }));
            }
        }
    }

    onContinue(): void {
        this.continue.emit();
    }

    private _getTranslationsStreams(packageNames: string[]) {
        return packageNames.map((packageName) => {
            const translateKeyPrefix = `app.packageDescriptions.${packageName}`;
            return this.translationsForComponentService.stream(translateKeyPrefix).pipe(
                startWith(this.translationsForComponentService.instant(translateKeyPrefix)),
                map((packageData) => {
                    const channel = packageData.channels[0];
                    const channelLineUpURL = packageData.channelLineUpURL;
                    const name = packageData.name;
                    return {
                        packageName,
                        features: channel.features,
                        channelLineUpURL,
                        name,
                    };
                })
            );
        });
    }

    private _setEndDate(leadOfferTerm: number, trialEndDate?: string) {
        const baseDate = trialEndDate ? new Date(trialEndDate) : new Date();
        baseDate.setMonth(baseDate.getMonth() + leadOfferTerm);
        this.endDate = baseDate;
    }

    selectedPlanIndex(index: number) {
        this.packageIndexSelected.next(index);
    }

    private _getPackageName(name): string {
        return this._withoutPlatformNamePipe.transform(this.translationsForComponentService.instant('app.packageDescriptions.' + name + '.name'), name);
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}

@NgModule({
    declarations: [SxmUiPlanComparisonEnhancedGridComponent],
    exports: [SxmUiPlanComparisonEnhancedGridComponent],
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiWithoutPlatformNamePipeModule, SharedSxmUiUiAccordionChevronModule],
})
export class SharedSxmUiUiPlanComparisonEnhancedGridModule {}
