import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, zip } from 'rxjs';
import { map, startWith, switchMap, flatMap } from 'rxjs/operators';
import { UserSettingsService, CURRENCY_PIPE_OPTIONAL_DECIMAL_NUMBER_FORMAT } from '@de-care/settings';
import { WithoutPlatformNamePipe } from '@de-care/shared/sxm-ui/ui-without-platform-name-pipe';

export interface PlanComparisonGridParams {
    leadOfferTerm: number;
    trialEndDate?: string;
    familyDiscount?: number;
    selectedPackageName: string;
    leadOfferPackageName: string;
}

interface PlanComparisonGridParamsInternal {
    features: { tooltipText?: string; name: string; checkMarks: boolean[]; counts: any }[];
    channelLineUpURLs: string[];
    selectedPackageIndex: number;
    selectedPackageName: string;
    selectedName: string;
    names: string[];
}

export interface RetailPriceAndMrdEligibility {
    pricePerMonth: number;
    mrdEligible: boolean;
}

@Component({
    selector: 'plan-comparison-grid',
    templateUrl: './plan-comparison-grid.component.html',
    styleUrls: ['plan-comparison-grid.component.scss'],
})
export class PlanComparisonGridComponent implements OnInit {
    constructor(private _translateService: TranslateService, private _userSettingsService: UserSettingsService, private _withoutPlatformNamePipe: WithoutPlatformNamePipe) {}

    @Output() continue = new EventEmitter<void>();
    @Output() packageIndexSelected = new EventEmitter<number>();
    @Input() displayCallsToAction: boolean = true;
    @Input() set packageNames(packageNames: string[]) {
        // Observable stream for pkg names
        this._packageNames$.next(packageNames);
    }

    @Input() set planComparisonGridParams(params: PlanComparisonGridParams) {
        this._setEndDate(params.leadOfferTerm, params.trialEndDate);
        this.selectedPackageName = params.selectedPackageName;
        this.leadOfferPackageName = params.leadOfferPackageName;
        this.familyDiscount = params.familyDiscount;
    }

    @Input() retailPrices: RetailPriceAndMrdEligibility[];
    @Input() set selectedPackageIndex(index: number) {
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
    selectedPackageType = '';
    translateKey = 'offers.planComparisonGridComponent.';

    dateFormat$: Observable<string>;
    locale: string;
    leadOfferPackageName: string;
    familyDiscount: number;
    selectedPackageName: string;
    priceFormat = CURRENCY_PIPE_OPTIONAL_DECIMAL_NUMBER_FORMAT;
    currentLang: string;
    endDate: Date;
    tfnType: string;

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
            const features = packages[packages.length - 1]?.features?.map((featureObj) => {
                return {
                    name: featureObj.name,
                    // Return true if the current feature being iterated over is included in the package
                    checkMarks: packages.map(
                        (packageOption) =>
                            !!packageOption.features?.find((o) => {
                                return o.name === featureObj.name;
                            })
                    ),
                    tooltipText: featureObj.tooltipText && featureObj.tooltipText,
                    counts: packages.map((packageOption) => {
                        // First, check to see if feature exists in the package
                        const featureIndex = packageOption.features?.findIndex((o) => o.name === featureObj.name);
                        // If it exists, return the value for count
                        return featureIndex > -1 && packageOption.features[featureIndex].count ? packageOption.features[featureIndex].count : null;
                    }),
                };
            });
            const names = packages.map((i) => i.name);
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
        this.dateFormat$ = this._userSettingsService.dateFormat$;
        this.locale = this._translateService.currentLang;
        this.tfnType = this.isProactive ? 'PROACTIVE' : 'REACTIVE';
    }

    onContinue(): void {
        this.continue.emit();
    }

    private _getTranslationsStreams(packageNames: string[]) {
        return packageNames.map((packageName) => {
            const translateKey = `app.packageDescriptions.${packageName}`;
            return this._translateService.stream(translateKey).pipe(
                startWith(this._translateService.instant(translateKey)),
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

    private _getPackageName(name): string {
        return this._withoutPlatformNamePipe.transform(this._translateService.instant('app.packageDescriptions.' + name + '.name'), name);
    }

    selectedPlanIndex(index: number) {
        this.packageIndexSelected.next(index);
    }
}
