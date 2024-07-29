import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getSxmValidator } from '@de-care/shared/validation';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { behaviorEventErrorsFromUserInteraction, behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import * as uuid from 'uuid/v4';

type LookupType = 'radioId' | 'vin' | 'licensePlate';

export interface DeviceIdSelection {
    lookupType: LookupType;
    identifier?: string | { licensePlate: string; state: string };
}

export interface DeviceLookupIdOptionsFormComponentApi {
    completedProcessing(): void;
    showSystemError(): void;
    showRadioIdError(): void;
    showVinError(): void;
    showLicensePlateError(): void;
}

@Component({
    selector: 'device-lookup-id-options-form',
    templateUrl: './device-lookup-id-options-form.component.html',
    styleUrls: ['./device-lookup-id-options-form.component.scss'],
})
export class DeviceLookupIdOptionsFormComponent implements OnInit, AfterViewInit, OnDestroy, DeviceLookupIdOptionsFormComponentApi {
    @ViewChild('helpFindingRadioModal') private readonly _helpFindingRadioModal: SxmUiModalComponent;
    translateKeyPrefix = 'DomainsIdentityUiDeviceLookupModule.DeviceLookupIdOptionsFormComponent.';
    form: FormGroup;
    submitInitiated = false;
    processingSubmission$ = new BehaviorSubject(false);
    isSystemError$ = new BehaviorSubject(false);
    isRadioIdExist$ = new BehaviorSubject(false);
    isLicensePlateError$ = new BehaviorSubject(false);
    isVinError$ = new BehaviorSubject(false);
    @Input() allowLicensePlate = true;
    @Output() deviceIdSelected = new EventEmitter<DeviceIdSelection>();
    private _unsubscribe$ = new Subject();
    private _radioIdControl: AbstractControl;
    private _vinControl: AbstractControl;
    private _licensePlateControl: AbstractControl;
    private _stateControl: AbstractControl;
    deviceHelpModalAriaDescribedbyTextId = uuid();

    constructor(private readonly _formBuilder: FormBuilder, private readonly _store: Store) {}

    completedProcessing(): void {
        this.processingSubmission$.next(false);
    }

    showSystemError(): void {
        this.isSystemError$.next(true);
    }
    showRadioIdError(): void {
        this.isRadioIdExist$.next(true);
    }
    showVinError(): void {
        this.isVinError$.next(true);
    }
    showLicensePlateError(): void {
        this.isLicensePlateError$.next(true);
    }
    ngOnInit(): void {
        this.form = this._formBuilder.group({
            lookupType: 'radioId',
            radioId: ['', getSxmValidator('radioId')],
            vin: '',
            licensePlate: '',
            state: null,
        });

        this._radioIdControl = this.form.get('radioId');
        this._vinControl = this.form.get('vin');
        this._licensePlateControl = this.form.get('licensePlate');
        this._stateControl = this.form.get('state');

        this.form
            .get('lookupType')
            .valueChanges.pipe(
                takeUntil(this._unsubscribe$),
                filter((value) => !!value)
            )
            .subscribe((lookupType: LookupType) => {
                this._removeValidators(this.form);
                switch (lookupType) {
                    case 'radioId':
                        this._radioIdControl.setValidators(getSxmValidator('radioId'));
                        this._radioIdControl.updateValueAndValidity();
                        break;
                    case 'vin':
                        this._vinControl.setValidators(getSxmValidator('vin'));
                        this._vinControl.updateValueAndValidity();
                        break;
                    case 'licensePlate':
                        this._licensePlateControl.setValidators(getSxmValidator('licencePlateNumber'));
                        this._licensePlateControl.updateValueAndValidity();
                        this._stateControl.setValidators([Validators.required]);
                        this._stateControl.updateValueAndValidity();
                        break;
                }
                this.submitInitiated = false;
            });
    }
    ngAfterViewInit(): void {
        this._dispatchImpressionForComponent();
    }

    ngOnDestroy(): void {
        if (this._unsubscribe$) {
            this._unsubscribe$.next();
            this._unsubscribe$.complete();
        }
    }
    openFindradioIdModal() {
        this._helpFindingRadioModal.open();
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'overlay:howdoifindmyradioid' }));
    }
    handleModalClosed() {
        this._dispatchImpressionForComponent();
    }
    private _dispatchImpressionForComponent(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'flepznotfoundtryrid' }));
    }

    onSubmit() {
        this.submitInitiated = true;
        this.isSystemError$.next(false);
        this.isRadioIdExist$.next(false);
        this.isVinError$.next(false);
        this.isLicensePlateError$.next(false);
        this.form.get('lookupType').markAsTouched();
        switch (this.form.value.lookupType) {
            case 'radioId':
                this._radioIdControl.markAsTouched();
                break;
            case 'vin':
                this._vinControl.markAsTouched();
                break;
            case 'licensePlate':
                this._licensePlateControl.markAsTouched();
                this._stateControl.markAsTouched();
                break;
        }
        if (this.form.valid) {
            this.processingSubmission$.next(true);
            switch (this.form.value.lookupType) {
                case 'radioId':
                    this.deviceIdSelected.next({ lookupType: 'radioId', identifier: this.form.value.radioId });
                    break;
                case 'vin':
                    this.deviceIdSelected.next({ lookupType: 'vin', identifier: this.form.value.vin });
                    break;
                case 'licensePlate':
                    this.deviceIdSelected.next({ lookupType: 'licensePlate', identifier: { licensePlate: this.form.value.licensePlate, state: this.form.value.state } });
                    break;
            }
        } else {
            const errors = [];
            if (this._radioIdControl.hasError('invalidRadioIdOrVin')) {
                errors.push('Auth - Missing or invalid radio ID/VIN');
            }
            if (errors.length > 0) {
                this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors }));
            }
        }
    }

    private _removeValidators(form: FormGroup) {
        Object.keys(form.controls).forEach((controlName) => {
            if (controlName !== 'lookupType') {
                form.get(controlName).clearValidators();
                form.get(controlName).updateValueAndValidity();
            }
        });
    }
}
