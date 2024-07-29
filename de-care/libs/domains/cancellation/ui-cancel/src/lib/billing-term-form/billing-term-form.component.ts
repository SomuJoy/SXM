import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export interface Plan {
    planCode: String;
    price: number;
    retailPrice: number;
    termLength: number;
    savingsPercentage: number; //TODO: confirm that we don't need this for billing term
    term: String;
}

@Component({
    selector: 'de-care-billing-term-form',
    templateUrl: './billing-term-form.component.html',
    styleUrls: ['./billing-term-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingTermFormComponent implements OnInit {
    billingTermForm: FormGroup;
    @Input() plans: Plan[];
    @Input() currentLang: string;
    @Output() planSelected = new EventEmitter();
    @Input() set selectedPlanCode(planCode: string) {
        if (!planCode) {
            this.selectedPlanCode = '';
            this._reset();
        }
    }
    selectedPlan: Plan = null;
    submitted = false;

    translateKeyPrefix = 'domainsCancellationUiCancel.billingTermFormComponent';

    constructor(private readonly _formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.billingTermForm = this.buildForm();
    }

    private buildForm() {
        return this._formBuilder.group({ billingTerms: ['', Validators.required] });
    }

    private _reset(): void {
        this.planSelected = null;
    }

    onSubmit(): void {
        this.submitted = true;
        if (this.billingTermForm.valid) {
            this.planSelected.emit(this.selectedPlan?.planCode);
        }
    }
}
