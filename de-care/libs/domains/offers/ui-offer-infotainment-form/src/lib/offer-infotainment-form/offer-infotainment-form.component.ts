import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OfferInfo } from '@de-care/domains/offers/ui-offer-description';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import * as uuid from 'uuid/v4';

export interface InfotainmentPlan {
    offerInfo: OfferInfo;
    planCode: string;
    currentlyHave: boolean;
    isBundlePlan: boolean;
    bundleSavingsAmount: number;
    bundleSubPackageNames?: string[];
}

export interface InfotainmentPlanOption {
    planCode: string;
    isSamePackage: boolean;
    data: InfotainmentPlanData;
    currentlyHave: boolean;
    isBundlePlan: boolean;
    bundleSavingsAmount: number;
    bundleSubPackageNames?: string[];
    packageName: string;
}

interface InfotainmentPlanData {
    platformPlan: string;
    longDescription: string;
    priceAndTermDescTitle: string;
    processingFeeDisclaimer: string;
    packageFeatures: { packageName: string; features: { name: string; tooltipText: string }[] }[];
    theme: string;
    presentation: string;
}

@Component({
    selector: 'offer-infotainment-form',
    templateUrl: './offer-infotainment-form.component.html',
    styleUrls: ['./offer-infotainment-form.component.scss'],
})
export class OfferInfotainmentFormComponent implements OnInit, OnChanges, OnDestroy {
    @Input() infotainmentPlans: InfotainmentPlan[];
    @Input() planOptions: InfotainmentPlanOption[];

    @Output() selectedInfotainmentPlans = new EventEmitter<string[]>();
    @Output() clickedInfotainmentPlan = new EventEmitter<string>();

    translationKeyPrefix = 'domainsOffersUIOfferInfotainmentFormModule.offerInfotainmentFormComponent.';
    currentLang$ = this._translateService.onLangChange.pipe(map((lang) => lang.lang));
    form: FormGroup;
    inputID = uuid();
    private _destroy$: Subject<boolean> = new Subject<boolean>();
    private _bundledSubPlanCodes: string[];
    private _bundlePlanCode: string;
    private _allBundledPackagesPresent: boolean;

    constructor(private readonly _translateService: TranslateService, private readonly _formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this._buildForm();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.planOptions) {
            this._buildForm();
        }
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    private _buildForm(): void {
        this.form = this._formBuilder.group({});
        this.planOptions.forEach(({ planCode, currentlyHave, isBundlePlan, bundleSubPackageNames }) => {
            if (isBundlePlan) {
                this._bundlePlanCode = planCode;
                this._bundledSubPlanCodes = this.planOptions
                    .filter((plan) => bundleSubPackageNames.indexOf(plan.packageName) > -1)
                    .map(({ planCode: subPlanCode }) => subPlanCode);
                this._allBundledPackagesPresent = this._bundledSubPlanCodes.length === bundleSubPackageNames.length;
            }
            this.form.addControl(planCode, this._formBuilder.control(false));
            const planCodeControl = this.form.get(planCode);
            if (currentlyHave) {
                this._checkControl(planCode);
            }
            planCodeControl.valueChanges.pipe(takeUntil(this._destroy$)).subscribe((checked) => {
                if (checked) {
                    if (isBundlePlan) {
                        this._unselectBundledPlanCodes();
                    } else {
                        this._determinePlanSelection(planCode);
                    }
                }
            });
        });
    }

    private _unselectBundledPlanCodes(): void {
        this._bundledSubPlanCodes.forEach((planCode) => this._uncheckControl(planCode));
    }

    private _determinePlanSelection(planCode: string): void {
        const selectedBundlePlans = this._getSelectedPlanCodes().filter((plan) => !!this._bundledSubPlanCodes && this._bundledSubPlanCodes.indexOf(plan) > -1);
        const selectedPlanCodeNotInBundle = !!this._bundledSubPlanCodes ? this._bundledSubPlanCodes.indexOf(planCode) > -1 : true;

        if (this._allBundledPackagesPresent && selectedBundlePlans.length === this._bundledSubPlanCodes.length) {
            this._checkControl(this._bundlePlanCode);
            this._unselectBundledPlanCodes();
        } else if (!!this._bundlePlanCode && this._getSelectedPlanCodes().length > 0 && selectedPlanCodeNotInBundle) {
            this._uncheckControl(this._bundlePlanCode);
        }
    }

    private _uncheckControl(controlName: string): void {
        this.form.get(controlName).patchValue(false, { emitEvent: false });
    }

    private _checkControl(controlName: string): void {
        this.form.get(controlName).patchValue(true, { emitEvent: false });
    }

    private _getSelectedPlanCodes(): string[] {
        return this.planOptions.filter(({ planCode }) => this.form.get(planCode).value).map(({ planCode }) => planCode);
    }

    onClickedInfotainment(planCode: string) {
        this.clickedInfotainmentPlan.emit(planCode);
    }

    onSubmit(): void {
        if (this.form.valid) {
            this.selectedInfotainmentPlans.emit(this._getSelectedPlanCodes());
        }
    }
}
