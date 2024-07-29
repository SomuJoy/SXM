import { Component, Input, OnInit } from '@angular/core';
import { UserSettingsService } from '@de-care/settings';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, zip } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
interface PackagesComparisonParamsInternal {
    features: { tooltipText?: string; name: string; checkMarks: boolean[]; counts: any }[];
    channelLineUpURLs: string[];
    selectedPackageIndex: number;
    selectedPackageName: string;
    selectedName: string;
    names: string[];
    packageNames: string[];
}

export interface Feature {
    name: string;
    tooltipText: string;
}

interface Package {
    packageName: string;
    basePrice: number;
    pricePerMonth: number;
    mrdEligible: true;
}
@Component({
    selector: 'sxm-ui-packages-comparison',
    templateUrl: './packages-comparison.component.html',
    styleUrls: ['./packages-comparison.component.scss']
})
export class PackagesComparisonComponent implements OnInit {
    translateKeyPrefix = 'sharedSxmUiUiPackageComparisonModule.packagesComparisonComponent.';
    dateFormat$: Observable<string>;
    locale: string;
    isQuebec$ = this._userSettingsService.isQuebec$;
    private _packages$: BehaviorSubject<Package[]> = new BehaviorSubject([]);
    constructor(private _translateService: TranslateService, private _userSettingsService: UserSettingsService) {}

    @Input() set packages(packages: Package[]) {
        const packagesSortedByPrice = packages.sort((pA, pB) => pA.basePrice - pB.basePrice);
        this._packages$.next(packagesSortedByPrice);
    }
    @Input() familyDiscount: number;
    @Input() endDate: Date;
    @Input() hideInYourTrial = true;

    parameters$: Observable<PackagesComparisonParamsInternal> = this._packages$.pipe(
        switchMap(packages => {
            // Aggregate together all observable streams for each package
            return zip(...this._getTranslationsStreams(packages));
        }),
        map(packages => {
            const allFeatures = packages[packages.length - 1];
            const features = allFeatures.features.map(allFeature => {
                return {
                    name: allFeature.name,
                    // Return true if the current feature being iterated over is included in the package
                    checkMarks: packages.map(aPackage => {
                        return !!aPackage.features.find(feature => {
                            return allFeature.name === feature.name;
                        });
                    }),
                    tooltipText: allFeature.tooltipText,
                    counts: packages.map(packageOption => {
                        const featureIndex = packageOption.features.findIndex(o => o.name === allFeature.name);
                        return featureIndex > -1 && packageOption.features[featureIndex].count;
                    })
                };
            });

            const names = packages.map(i => i.name);
            const prices = packages.map(({ mrdEligible, pricePerMonth }) => ({
                pricePerMonth,
                mrdEligible
            }));

            const selectedPackageIndex = packages.length - 1;

            return {
                prices,
                features,
                channelLineUpURLs: packages.map(i => i.channelLineUpURL),
                names,
                packageNames: packages.map(p => p.packageName),
                selectedPackageIndex,
                selectedName: names[selectedPackageIndex],
                selectedPackageName: packages[selectedPackageIndex]?.packageName
            };
        })
    );

    ngOnInit() {
        this.dateFormat$ = this._userSettingsService.dateFormat$;
        this.locale = this._translateService.currentLang;
    }

    private _getTranslationsStreams(packages: Package[]) {
        return packages.map(({ packageName, mrdEligible, pricePerMonth }) => {
            const translateKey = `app.packageDescriptions.${packageName}`;
            return this._translateService.stream(translateKey).pipe(
                startWith(this._translateService.instant(translateKey)),
                map(packageData => {
                    return {
                        pricePerMonth,
                        mrdEligible,
                        packageName,
                        ...packageData,
                        features: packageData?.channels[0]?.features?.filter(Boolean) || []
                    };
                })
            );
        });
    }
}
