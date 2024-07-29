import { Component, ContentChild, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';

export interface PlanSelectionData {
    packages: PlanPackageData[];
    selectedPackageName: string;
    selectedPackageIndex?: number;
    leadOfferPackageName: string;
    leadOfferEndDate: string;
    currentPlanIndex?: number; // if populated, will mark given index as the current/in-trial plan
}

export interface PlanPackageData {
    packageName: string;
    pricePerMonth: number;
    planCode: string;
    price: number;
    parentPackageName?: string;
}

@Component({
    selector: 'sxm-ui-plan-selection',
    templateUrl: 'plan-selection.component.html',
    styleUrls: ['plan-selection.component.scss']
})
export class SxmUiPlanSelectionComponent {
    translateKeyPrefix = 'SharedSxmUiUiPlanSelectionModule.SxmUiPlanSelectionComponent';

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
                : this.packages.findIndex(p => p.packageName === planSelectionData.selectedPackageName);
        if (selectedIndex !== -1) {
            this.selectedPackageName = this.packages[selectedIndex].packageName;
            this.packageIndexSelected.emit(selectedIndex);
        }
    }

    @Input() showChoiceNotAvailableError: boolean = false;

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

    constructor(private readonly translateService: TranslateService) {}

    ngOnInit() {
        this.currentLang = this.translateService.currentLang;
        this.translateService.onLangChange.pipe(takeUntil(this.unsubscribe)).subscribe(ev => {
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
