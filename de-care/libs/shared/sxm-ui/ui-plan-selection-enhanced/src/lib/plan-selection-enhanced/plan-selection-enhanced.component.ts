import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, ContentChild, ElementRef, EventEmitter, Input, Output, OnDestroy, OnInit, NgModule } from '@angular/core';
import { SharedSxmUiUiPlatformFromPackageNamePipeModule } from '@de-care/shared/sxm-ui/ui-platform-from-package-name-pipe';
import { SharedSxmUiUiWithoutPlatformNamePipeModule } from '@de-care/shared/sxm-ui/ui-without-platform-name-pipe';
import { ComponentLocale, ComponentWithLocale, LanguageResources, ModuleWithTranslation, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface PlanSelectionData {
    packages: PlanPackageData[];
    selectedPackageName: string;
    selectedPackageIndex?: number;
    leadOfferPackageName: string;
    leadOfferEndDate: string;
    currentPlanIndex?: number; // if populated, will mark given index as the current/in-trial plan
}

interface PlanPackageData {
    packageName: string;
    pricePerMonth: number;
    planCode: string;
    price: number;
    parentPackageName?: string;
}
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-plan-selection-enhanced',
    templateUrl: './plan-selection-enhanced.component.html',
    styleUrls: ['./plan-selection-enhanced.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiPlanSelectionEnhancedComponent implements ComponentWithLocale, OnInit, OnDestroy {
    languageResources: LanguageResources;
    translateKeyPrefix: string;

    @Output() packageNameSelected = new EventEmitter<string>();
    @Output() packageIndexSelected = new EventEmitter<number>();

    @Input() set planSelectionData(planSelectionData: PlanSelectionData) {
        this.packages = planSelectionData.packages;
        this.numPlans = this.packages.length;
        this.currentPlanIndex = planSelectionData.currentPlanIndex;
        // if the selectedIndex is not provided then find index that matches packageName
        const selectedIndex =
            planSelectionData.selectedPackageIndex !== null && planSelectionData.selectedPackageIndex !== undefined
                ? planSelectionData.selectedPackageIndex
                : this.packages.findIndex((p) => p.packageName === planSelectionData.selectedPackageName);
        if (selectedIndex !== -1) {
            this.selectedPackageName = this.packages[selectedIndex].packageName;
            this.packageIndexSelected.emit(selectedIndex);
        }
    }

    @Input() showChoiceNotAvailableError = false;

    @Input() isProactive: boolean;

    @Input() currentOrExpiredTrialPackage: string;

    packages: PlanPackageData[] = [];
    leadOfferPackageName: string;
    selectedPackageName: string;
    currentLang: string;
    plansNotAvailableToCustomerCopy: string;
    numPlans: number;
    currentPlanIndex: number;
    _selectedPackageIndex: number;

    @Input() set selectedPackageIndex(index: number) {
        if (this.packages && this.packages[index]) {
            this._selectedPackageIndex = index;
            const packageName = this.packages[index].packageName;
            this.packageNameSelected.emit(packageName);
            this.selectedPackageName = packageName;
        }
    }
    get selectedPackageIndex(): number {
        return this._selectedPackageIndex;
    }

    @ContentChild('contentReactiveText') contentReactiveText: ElementRef;
    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(private readonly translateService: TranslateService, readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }

    ngOnInit() {
        this.currentLang = this.translateService.currentLang;
        this.translateService.onLangChange.pipe(takeUntil(this.unsubscribe)).subscribe((ev) => {
            this.currentLang = ev.lang;
        });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    onSelectPackage(index: number) {
        this.selectedPackageIndex = index;
        this.packageIndexSelected.emit(index);
    }
}
@NgModule({
    declarations: [SxmUiPlanSelectionEnhancedComponent],
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiPlatformFromPackageNamePipeModule, SharedSxmUiUiWithoutPlatformNamePipeModule],
    exports: [SxmUiPlanSelectionEnhancedComponent],
})
export class SharedSxmUiUiPlanSelectionEnhancedModule {}
