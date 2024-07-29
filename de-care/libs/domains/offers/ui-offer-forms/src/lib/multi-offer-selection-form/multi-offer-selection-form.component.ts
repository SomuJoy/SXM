import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subject } from 'rxjs';
import { OfferOption } from '../offer-card-form-field-option/offer-card-form-field-option.component';
import { scrollToElementBySelector } from '@de-care/browser-common';
import { takeUntil } from 'rxjs/operators';

export interface OfferOptions {
    mainOffers: OfferOption[];
    additionalOffers: OfferOption[];
}

@Component({
    selector: 'multi-offer-selection-form',
    templateUrl: './multi-offer-selection-form.component.html',
    styleUrls: ['./multi-offer-selection-form.component.scss'],
})
export class MultiOfferSelectionFormComponent implements OnInit, OnChanges, OnDestroy {
    private _destroy$: Subject<boolean> = new Subject<boolean>();
    translateKeyPrefix = 'DomainsOffersUiOfferFormsModule.MultiOfferSelectionFormComponent.';
    form: FormGroup;
    optionFormControl: FormControl;
    validationError$ = new BehaviorSubject(false);
    processing$ = new BehaviorSubject(false);
    onlyOneOffer = false;
    @Input() offerOptions: OfferOptions;
    @Input() submitButtonLabel: string;
    @Input() allowContinueWithoutSelection = false;
    @Input() preSelectFirstOption = false;
    @Input() preSelectedPlanCode: string;
    @Input() set resetForm(reset: boolean) {
        if (reset) {
            this._reset();
        }
    }
    @Output() selected = new EventEmitter<{ planCode: string }>();
    @Output() submitted = new EventEmitter<{ planCode: string }>();

    constructor(private readonly _formBuilder: FormBuilder, private readonly _store: Store) {}

    ngOnInit(): void {
        this.optionFormControl = this._formBuilder.control(null, Validators.required);
        this.form = this._formBuilder.group({ planCode: this.optionFormControl });
        this.optionFormControl?.valueChanges.pipe(takeUntil(this._destroy$)).subscribe((planCode) => {
            this.setSelectedPlan(planCode);
        });
        this._setPlanCodeValueIfOnlyOneOffer();
        this._selectInitialSelection(this.preSelectedPlanCode);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.offerOptions && changes?.offerOptions.currentValue !== changes?.offerOptions.previousValue) {
            this.onlyOneOffer = this._onlyOneOfferInOfferOptions();
            this._setPlanCodeValueIfOnlyOneOffer();
        }
    }

    trackBy(index, item) {
        return item.planCode;
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    private setSelectedPlan(planCode: string) {
        this.selected.emit({ planCode });
    }

    private _onlyOneOfferInOfferOptions(): boolean {
        return this.offerOptions?.mainOffers?.length === 1 && (!this.offerOptions?.additionalOffers || this.offerOptions?.additionalOffers?.length === 0);
    }

    private _setPlanCodeValueIfOnlyOneOffer() {
        if (this.onlyOneOffer) {
            this._selectFirstOption();
        }
    }

    private _selectFirstOption() {
        const planCode = this.offerOptions.mainOffers[0].planCodeOptions[0].planCode;
        if (this.form?.controls?.planCode) {
            this.setSelectedPlan(planCode);
            this.form.controls.planCode.setValue(planCode, { emitEvent: false });
        }
    }

    private _selectInitialSelection(planCode: string) {
        const hasOffer = this.offerOptions?.mainOffers?.find((offer) => offer?.planCodeOptions[0]?.planCode === planCode);
        if (planCode && hasOffer && this.form?.controls?.planCode) {
            this.form.controls.planCode.setValue(planCode, { emitEvent: false });
        } else if (this.preSelectFirstOption) {
            this._selectFirstOption();
        }
    }

    private _reset(): void {
        this.validationError$.next(false);
        if (this.form) {
            this.form.reset();
        }
    }

    onSubmit() {
        this.processing$.next(true);
        this.validationError$.next(false);
        this.form.markAllAsTouched();
        if (this.form.valid) {
            this.submitted.emit({ planCode: this.form.value.planCode });
        } else if (this.allowContinueWithoutSelection) {
            // if allowed, it will emit a null planCode to indicate that nothing was chosen
            this.submitted.emit({ planCode: null });
        } else {
            this.validationError$.next(true);
            setTimeout(() => scrollToElementBySelector('.invalid-feedback'));
        }
        this.processing$.next(false);
    }
}
