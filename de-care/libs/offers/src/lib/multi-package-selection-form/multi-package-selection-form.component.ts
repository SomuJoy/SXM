import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { isChoicePackage } from '@de-care/data-services';
import * as uuid from 'uuid/v4';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

interface PackageData extends Partial<object> {
    planCode?: string;
}
interface PackagesWithUid {
    id: string;
    packageData: PackageData;
    packageOptions?: object[];
}

export interface MultiPackageSelectionData {
    eligiblePackages: object[];
    additionalEligiblePackages: object[];
    currentPackageName: string;
    bestPackages: string[];
}

@Component({
    selector: 'multi-package-selection-form',
    templateUrl: './multi-package-selection-form.component.html',
    styleUrls: ['./multi-package-selection-form.component.scss']
})
export class MultiPackageSelectionFormComponent implements OnInit, OnChanges, OnDestroy {
    @Output() continue = new EventEmitter<string>();
    @Output() packageClicked = new EventEmitter<string>();
    @Output() continueWithCurrentPackage = new EventEmitter();
    @Output() continueWithErrors = new EventEmitter();
    @Input() data: MultiPackageSelectionData = null;
    @Input() usePromotionalTextCopy = false; //if true the wording on the offer radio button refers to "taking" offer
    @Input() set currentPlanCode(planCode: string) {
        if (!planCode) {
            this._reset();
        }
    }
    @Input() shouldPreSelectFirstPackage = false;
    @Input() allowContinueWithoutSelection = false;
    @Input() displayError = true;
    @Input() isAddingPackage = false;
    eligiblePackagesWithUID: PackagesWithUid[] = [];
    additionalEligiblePackagesWithUID: PackagesWithUid[] = [];
    totalNumberOfPackages = 0;
    multiPackageFormInvalid = false;
    form: FormGroup;

    private _destroy$: Subject<boolean> = new Subject<boolean>();

    ngOnInit() {
        this.form = new FormGroup({
            planCode: new FormControl(null, [Validators.required])
        });

        if (this.eligiblePackagesWithUID.length > 0 && this.shouldPreSelectFirstPackage) {
            this.handleUpdateSelectedPackage(this.eligiblePackagesWithUID[0]?.packageData?.planCode || null);
        }

        this.form
            .get('planCode')
            .valueChanges.pipe(distinctUntilChanged(), takeUntil(this._destroy$))
            .subscribe(planCode => {
                this.packageClicked.emit(planCode);
            });

        this.evaluateData(this.data);
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.data && changes.data.currentValue) {
            this.evaluateData(changes.data.currentValue);
        }
    }

    evaluateData(data: MultiPackageSelectionData) {
            const { additionalEligiblePackages, eligiblePackages } = this.data;
            if (Array.isArray(eligiblePackages) && eligiblePackages.length > 0) {
                this.eligiblePackagesWithUID = this._processGroupedOffers(eligiblePackages).map(packageData => ({
                    id: uuid(),
                    packageData
                }));
            }

            if (Array.isArray(additionalEligiblePackages) && additionalEligiblePackages.length > 0) {
                this.additionalEligiblePackagesWithUID = this._processGroupedOffers(additionalEligiblePackages).map(packageData => ({
                    id: uuid(),
                    packageData
                }));
            }

            this.totalNumberOfPackages = this.eligiblePackagesWithUID.length + this.additionalEligiblePackagesWithUID.length;

        // TODO: move this logic to the selector level

        if (isChoicePackage(data.currentPackageName) && this.eligiblePackagesWithUID.length > 0 && this.form) {
                // automatically preselect the package
                this.handleUpdateSelectedPackage(this.eligiblePackagesWithUID[0].packageData['planCode']);
        } else if (this.totalNumberOfPackages === 1 && this.form) {
            const hasChoicePackage =
                this.eligiblePackagesWithUID.length > 0
                    ? isChoicePackage(this.eligiblePackagesWithUID[0].packageData['packageName'])
                    : isChoicePackage(this.additionalEligiblePackagesWithUID[0].packageData['packageName']);

            if (!hasChoicePackage) {
                const planCode =
                    this.eligiblePackagesWithUID.length > 0
                        ? this.eligiblePackagesWithUID[0].packageData['planCode']
                        : this.additionalEligiblePackagesWithUID[0].packageData['planCode'];
                // automatically select the package

                this.handleUpdateSelectedPackage(planCode);
            }
        }
    }

    onContinue(): void {
        if (this.form.valid) {
            this.continue.emit(this.form.value.planCode);
            this.multiPackageFormInvalid = false;
        } else if (this.allowContinueWithoutSelection) {
            this.onContinueWithCurrentPackage();
        } else {
            this.multiPackageFormInvalid = this.displayError;
            !this.displayError && this.continueWithErrors.emit();
        }
    }

    onContinueWithCurrentPackage() {
        this._reset();
        this.continueWithCurrentPackage.emit();
    }

    handleUpdateSelectedPackage(planCode) {
        this.form.get('planCode').setValue(planCode);
    }

    private _reset(): void {
        this.multiPackageFormInvalid = false;
        if (this.form) {
            this.form.reset();
        }
    }

    private _processGroupedOffers(offers) {
        return offers.reduce((newSet: any[], offer) => {
            if (offer.parentPackageName) {
                const existingParent = newSet.find(i => i.packageName === offer.parentPackageName);
                if (existingParent) {
                    existingParent.packageOptions.push(offer);
                } else {
                    newSet.push(this._createParentOfferFromGroupedOffer(offer));
                }
            } else {
                newSet.push(offer);
            }
            return newSet;
        }, []);
    }

    private _createParentOfferFromGroupedOffer(offer) {
        return {
            ...offer,
            packageName: offer.parentPackageName,
            packageOptions: [offer]
        };
    }
}
