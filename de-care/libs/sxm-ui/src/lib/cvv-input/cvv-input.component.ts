import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, Validator, FormGroup, FormBuilder, AbstractControl, ValidationErrors, Validators } from '@angular/forms';

import { controlIsInvalid } from '@de-care/shared/validation';

@Component({
    selector: 'cvv-input',
    template: `
        <div class="row no-padding">
            <div class="column small-12 no-padding">
                <div class="input-container">
                    <!-- <label for="cvv">CVV</label> -->
                    <input type="text" placeholder="CVV" minlength="2" maxlength="100" qatag="CVVInfo" #cvvInput />
                </div>
                <div class="invalid-feedback">
                    <p>Enter a valid CVV</p>
                </div>
            </div>
        </div>
    `,
    styleUrls: ['./cvv-input.component.scss']
})
export class CvvInputComponent implements OnInit {
    @Input() submitted = false;
    @ViewChild('cvvInput', { static: false }) private cvvInput: ElementRef;

    cvvInputForm: FormGroup;

    controlIsInvalid = controlIsInvalid(() => {
        return false;
    });

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit() {
        this.cvvInputForm = this.formBuilder.group({
            cvvInput: [
                '',
                {
                    validators: [Validators.required, Validators.minLength(3), Validators.minLength(4)],
                    updateOn: 'blur'
                }
            ]
        });
    }
}
