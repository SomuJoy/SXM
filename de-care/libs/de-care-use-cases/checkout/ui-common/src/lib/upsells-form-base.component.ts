import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface UpsellPlanCodeOptions {
    packageUpsellPlanCode?: string;
    termUpsellPlanCode?: string;
    packageAndTermUpsellPlanCode?: string;
}
export interface UpsellCopy {
    packageCopyContent?: any;
    packageCopyContentWhenTermSelected?: any;
    termCopyContent?: any;
    termCopyContentWhenPackageSelected?: any;
}

@Directive()
export class UpsellsFormBaseComponent {
    form = new UntypedFormGroup({});
    packageUpsellFormField = new UntypedFormControl(false);
    termUpsellFormField = new UntypedFormControl(false);
    packageAndTermUpsellsAvailable$ = new BehaviorSubject<boolean>(false);
    private _selectedPlanCode: string | null;

    processing = false;
    @Input() set submissionProcessing(processing: boolean) {
        this.processing = processing;
        this.processing ? this.form.disable() : this.form.enable();
    }

    private _upsellPlanCodeOptions: UpsellPlanCodeOptions;
    @Input() set upsellPlanCodeOptions(upsellPlanCodeOptions: UpsellPlanCodeOptions) {
        this._upsellPlanCodeOptions = upsellPlanCodeOptions;
        if (this._upsellPlanCodeOptions.packageUpsellPlanCode) {
            this.form.addControl('packageUpgrade', this.packageUpsellFormField);
        }
        if (this._upsellPlanCodeOptions.termUpsellPlanCode) {
            this.form.addControl('termUpgrade', this.termUpsellFormField);
        }
        this.packageAndTermUpsellsAvailable$.next(!!this._upsellPlanCodeOptions?.packageAndTermUpsellPlanCode);
    }

    protected _copyContent$ = new BehaviorSubject<UpsellCopy>(null);

    @Output() planCodeSelected = new EventEmitter<string | null>();
    @Output() planCodeBeingConsidered = new EventEmitter<string | null>();

    protected _upsellSelected$: Observable<'package' | 'term' | 'packageAndTerm' | string> = this.form.valueChanges.pipe(
        startWith({}),
        map(({ packageUpgrade: packageChecked, termUpgrade: termChecked }) => {
            if (packageChecked && termChecked) {
                this._setCurrentlySelectedPlanCode(this._upsellPlanCodeOptions.packageAndTermUpsellPlanCode);
                return 'packageAndTerm';
            } else if (packageChecked) {
                this._setCurrentlySelectedPlanCode(this._upsellPlanCodeOptions.packageUpsellPlanCode);
                return 'package';
            } else if (termChecked) {
                this._setCurrentlySelectedPlanCode(this._upsellPlanCodeOptions.termUpsellPlanCode);
                return 'term';
            } else {
                this._setCurrentlySelectedPlanCode(null);
                return null;
            }
        })
    );

    packageUpgradeCopyContent$ = combineLatest([
        this._upsellSelected$,
        this._copyContent$.pipe(
            map(({ packageCopyContent, packageCopyContentWhenTermSelected }) => ({
                packageCopyContent,
                packageCopyContentWhenTermSelected,
            }))
        ),
    ]).pipe(
        map(([upsellSelected, { packageCopyContent, packageCopyContentWhenTermSelected }]) =>
            ['term'].includes(upsellSelected) ? packageCopyContentWhenTermSelected : packageCopyContent
        )
    );

    termUpgradeCopyContent$ = combineLatest([
        this._upsellSelected$,
        this._copyContent$.pipe(
            map(({ termCopyContent, termCopyContentWhenPackageSelected }) => ({
                termCopyContent,
                termCopyContentWhenPackageSelected,
            }))
        ),
    ]).pipe(
        map(([upsellSelected, { termCopyContent, termCopyContentWhenPackageSelected }]) =>
            ['package', 'packageAndTerm'].includes(upsellSelected) ? termCopyContentWhenPackageSelected : termCopyContent
        )
    );

    submitForm(): void {
        this.planCodeSelected.emit(this._selectedPlanCode);
    }

    private _setCurrentlySelectedPlanCode(planCode: string): void {
        this._selectedPlanCode = planCode;
        this.planCodeBeingConsidered.emit(this._selectedPlanCode);
    }
}
