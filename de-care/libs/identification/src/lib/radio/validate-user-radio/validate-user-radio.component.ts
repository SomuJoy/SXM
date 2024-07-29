import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, NgForm } from '@angular/forms';
import * as uuid from 'uuid/v4';
import { getSxmValidator } from '@de-care/shared/validation';
import { DataAccountService, AccountVerify, ErrorTypeEnum } from '@de-care/data-services';
import { DataLayerService, FrontEndErrorModel, FrontEndErrorEnum } from '@de-care/data-layer';
import { SxmLanguages } from '@de-care/app-common';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from '@de-care/settings';
import { BehaviorSubject } from 'rxjs';
import { behaviorEventReactionAuthenticationByRadioVerifySuccess, behaviorEventReactionAuthenticationByRadioVerifyFailure } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';

@Component({
    selector: 'validate-user-radio',
    templateUrl: './validate-user-radio.component.html',
    styleUrls: ['./validate-user-radio.component.scss']
})
export class ValidateUserRadioComponent implements OnInit, OnChanges {
    @Input() last4DigitsOfRadioId: string;
    @Input() isRadioClosed: boolean;
    @Input() prefilledLastName: string;
    @Input() ariaDescribedbyTextId = uuid();
    @Output() validUserInfo = new EventEmitter<{ lastName: string }>();
    @Output() invalidUserInfo = new EventEmitter();
    @Output() editInfo = new EventEmitter();

    @ViewChild('ngForm', { static: true }) public ngForm: NgForm;

    validationError$ = new BehaviorSubject<boolean>(false);
    frmLastNameId = uuid();
    frmPhoneId = uuid();
    frmZipId = uuid();
    isCanada = false;
    validateUserForm: FormGroup;
    currentLang: SxmLanguages;
    loading$ = new BehaviorSubject<boolean>(false);

    get frmControls(): {
        [key: string]: AbstractControl;
    } {
        return this.validateUserForm.controls;
    }

    constructor(
        private _fb: FormBuilder,
        private _dataAccount: DataAccountService,
        private _dataLayerSrv: DataLayerService,
        private _translate: TranslateService,
        private _settingsSrv: SettingsService,
        private _store: Store
    ) {}

    ngOnInit() {
        this.currentLang = this._translate.currentLang as SxmLanguages;
        this.isCanada = this._settingsSrv.isCanadaMode;
        this.validateUserForm = this._fb.group({
            lastName: [this.prefilledLastName ? this.prefilledLastName : '', getSxmValidator('lastName', this._settingsSrv.settings.country, this.currentLang)],
            phoneNumber: this._fb.control('', {
                updateOn: 'blur'
            }), //validated by custom phoneNumber directive
            zipCode: this._fb.control('', {
                validators: getSxmValidator('zipCode', this._settingsSrv.settings.country, this.currentLang),
                updateOn: 'blur'
            })
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.last4DigitsOfRadioId) {
            if (this.validateUserForm) {
                this.ngForm.resetForm();
            }
        }
    }

    onSubmit() {
        if (this.validateUserForm.valid) {
            this.loading$.next(true);
            this.validationError$.next(false);
            const accountData: AccountVerify = this.validateUserForm.value;
            this._dataAccount.verify(accountData).subscribe(
                response => {
                    if (response) {
                        this.validUserInfo.emit({ lastName: this.validateUserForm.get('lastName').value });
                        this._store.dispatch(behaviorEventReactionAuthenticationByRadioVerifySuccess());
                    } else if (this.isRadioClosed) {
                        this.invalidUserInfo.emit({
                            lastName: this.frmControls.lastName.value,
                            phoneNumber: this.frmControls.phoneNumber.value,
                            zipCode: this.frmControls.zipCode.value
                        });
                        this._store.dispatch(behaviorEventReactionAuthenticationByRadioVerifySuccess());
                    } else {
                        this.validationError$.next(true);
                        this._store.dispatch(behaviorEventReactionAuthenticationByRadioVerifyFailure());
                        this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.EventFailedActVerify));
                    }
                    this.loading$.next(false);
                },
                () => {
                    this.loading$.next(false);
                    this.validationError$.next(true);
                    this._store.dispatch(behaviorEventReactionAuthenticationByRadioVerifyFailure());
                    this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.EventFailedActVerify));
                }
            );
        } else {
            if (this.frmControls.lastName.errors) {
                this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.IdentMissingLastName));
            }
            if (this.frmControls.phoneNumber.errors) {
                this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.IdentMissingPhone));
            }
            if (this.frmControls.zipCode.errors) {
                this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.IdentMissingZipCode));
            }
        }
    }

    edit($event: MouseEvent) {
        $event.preventDefault();
        this.editInfo.emit();
    }
}
