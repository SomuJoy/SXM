import { Component, Input, EventEmitter, Output, OnInit, OnDestroy, ContentChild, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

export interface FollowOnPlanSelectionData {
    packages: FollowOnSelectionPackageData[];
    selectedPackageName: string;
    leadOfferPackageName: string;
    leadOfferEndDate: string;
}

export interface FollowOnSelectionPackageData {
    packageName: string;
    pricePerMonth: number;
    planCode: string;
    price: number;
    parentPackageName?: string;
}

@Component({
    selector: 'sxm-ui-follow-on-selection',
    templateUrl: './follow-on-selection.component.html',
    styleUrls: ['follow-on-selection.component.scss'],
})
export class FollowOnSelectionComponent implements OnInit, OnDestroy {
    @Output() selected = new EventEmitter<string>();
    @Output() packageIndexSelected = new EventEmitter<number>();

    @Input() set planSelectionData(followOnData: FollowOnPlanSelectionData) {
        this.packages = followOnData.packages;
        this.selectedPackageName = followOnData.selectedPackageName;
        this.leadOfferPackageName = followOnData.leadOfferPackageName;
    }
    @Input() showChoiceNotAvailableError: boolean = false;

    @Input() isProactive: boolean;

    @Input() showPlatformName = true;

    packages: FollowOnSelectionPackageData[] = [];
    leadOfferPackageName: string;
    selectedPackageName: string;
    currentLang: string;
    plansNotAvailableToCustomerCopy: string;

    @Input() set selectedPackageIndex(index: number) {
        if (this.packages && this.packages[index]) {
            const packageName = this.packages[index].packageName;
            this.selected.emit(packageName);
            this.selectedPackageName = packageName;
        }
    }

    @ContentChild('contentReactiveText') contentReactiveText: ElementRef;
    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(private readonly translateService: TranslateService) {}

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

    selectPackage(selectedPkg: FollowOnSelectionPackageData) {
        const packageName = selectedPkg.packageName;
        this.selected.emit(packageName);
        this.selectedPackageName = packageName;
        this.emitSelectedIndex(packageName);
    }

    private emitSelectedIndex(packageName: string) {
        this.packageIndexSelected.emit(this.packages.findIndex((pkg) => pkg.packageName === packageName));
    }
}
