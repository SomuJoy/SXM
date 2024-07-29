import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getSxmValidator } from '@de-care/shared/validation';
import { Subject } from 'rxjs';
import { takeUntil, filter, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { behaviorEventInteractionContinueVerifyOptionSelected, behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { getPhoneVerificationRequestCodeLimitExceeded } from '@de-care/domains/account/state-two-factor-auth';

export interface VerifyOptions {
    maskedEmail?: string;
    maskedPhoneNumber?: string;
    canUsePhone?: boolean;
    canUseRadioId?: boolean;
    canUseAccountNumber?: boolean;
}

type VerifyType = 'email' | 'text' | 'radioId' | 'accountNumber';

export interface VerifyTypeSelection {
    verifyType: VerifyType;
    identifier?: string;
}

export interface VerifyOptionsFormComponentApi {
    reset(): void;
}

@Component({
    selector: 'verify-options-form',
    templateUrl: './verify-options-form.component.html',
    styleUrls: ['./verify-options-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyOptionsFormComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit, VerifyOptionsFormComponentApi {
    @Input() options: VerifyOptions;
    @Input() processing = false;
    @Input() accountIsInvalid = false;
    @Input() firstOptionPreselected = false;
    @Input() phoneMatchesAccount = true;
    @Input() radioIDInvalid = false;
    @Input() showChatWithAgentLink = false;
    @Output() verifyTypeSelected = new EventEmitter<VerifyTypeSelection>();
    @Output() helpFindRadioClicked = new EventEmitter<void>();
    translateKeyPrefix = 'domainsAccountUiTwoFactorAuth.verifyOptionsFormComponent';
    form: FormGroup;
    submitted = false;
    private _unsubscribe$ = new Subject();
    getPhoneVerificationRequestCodeLimitExceeded$ = this._store.select(getPhoneVerificationRequestCodeLimitExceeded);

    constructor(private readonly _formBuilder: FormBuilder, private readonly _store: Store) {}

    ngOnInit() {
        this.form = this._formBuilder.group({
            verifyType: [''],
            text: [null],
            radioId: [null],
            accountNumber: [null],
            agreeToTextMessage: [false],
        });
        const identifierTextControl = this.form.get('text');
        const identifierRadioIdControl = this.form.get('radioId');
        const identifierAccountControl = this.form.get('accountNumber');
        const identifierAgreeMessageControl = this.form.get('agreeToTextMessage');

        this.form
            .get('verifyType')
            .valueChanges.pipe(
                takeUntil(this._unsubscribe$),
                filter((value) => !!value)
            )
            .subscribe((verifyType: VerifyType) => {
                switch (verifyType) {
                    case 'text':
                        this._removeValidators(this.form);
                        identifierTextControl.setValidators(getSxmValidator('phoneNumber'));
                        identifierAgreeMessageControl.setValidators(Validators.requiredTrue);
                        identifierAgreeMessageControl.updateValueAndValidity();
                        break;
                    case 'radioId':
                        this._removeValidators(this.form);
                        identifierRadioIdControl.setValidators(getSxmValidator('radioId'));
                        identifierRadioIdControl.updateValueAndValidity();
                        break;
                    case 'accountNumber':
                        this._removeValidators(this.form);
                        identifierAccountControl.setValidators(getSxmValidator('accountNumber'));
                        identifierAccountControl.updateValueAndValidity();
                        break;
                    default:
                        this._removeValidators(this.form);
                        break;
                }
                this.submitted = false;
            });

        this.form.get('verifyType').setValue(this.firstOptionPreselected ? this._setInitialVerifyTypeFromInput(this.options) : null);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes?.options?.currentValue) {
            this.form?.get('verifyType')?.setValue(this.firstOptionPreselected ? this._setInitialVerifyTypeFromInput(this.options) : null);
        }
    }

    ngAfterViewInit() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'overlay:verifyoptions' }));
    }

    private _removeValidators(form: FormGroup) {
        Object.keys(form.controls).forEach((controlName) => {
            if (controlName !== 'verifyType') {
                form.get(controlName).clearValidators();
                form.get(controlName).updateValueAndValidity();
            }
        });
    }

    private _setInitialVerifyTypeFromInput(options: VerifyOptions): VerifyType {
        return !!options?.maskedEmail
            ? 'email'
            : !!options?.canUsePhone
            ? 'text'
            : !!options?.canUseRadioId
            ? 'radioId'
            : !!options?.canUseAccountNumber
            ? 'accountNumber'
            : null;
    }

    onSubmit() {
        this.submitted = true;
        this.form.markAllAsTouched();
        const verifyType = this.form.get('verifyType').value;

        if (this.form.pending) {
            this.form.statusChanges
                .pipe(
                    filter((status) => status !== 'PENDING'),
                    take(1),
                    takeUntil(this._unsubscribe$)
                )
                .subscribe(() => {
                    this.onSubmit();
                });
        } else if (this.form.valid && !!verifyType) {
            this.verifyTypeSelected.emit({ verifyType, identifier: this.form.get(verifyType).value });
            this._store.dispatch(behaviorEventInteractionContinueVerifyOptionSelected({ selectedVerificationOption: verifyType }));
        }
    }

    reset(): void {
        this.form.reset();
        this.form.get('verifyType').setValue(this.firstOptionPreselected ? this._setInitialVerifyTypeFromInput(this.options) : null);
        this.submitted = false;
    }

    ngOnDestroy(): void {
        if (this._unsubscribe$) {
            this._unsubscribe$.next();
            this._unsubscribe$.complete();
        }
    }
}
