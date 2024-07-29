import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, NgForm } from '@angular/forms';
import * as uuid from 'uuid/v4';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from '@de-care/settings';
import { SxmLanguages } from '@de-care/app-common';
import { getSxmValidator, controlIsInvalid } from '@de-care/shared/validation';
import { DataLayerService, FrontEndErrorModel, FrontEndErrorEnum } from '@de-care/data-layer';
import { AccountVerify, DataAccountService, ErrorTypeEnum } from '@de-care/data-services';

interface VerifyLPZFormComponentApi {
    clearForm: () => void;
}

@Component({
    selector: 'validate-lpz-form',
    templateUrl: './validate-lpz-form.component.html',
    styleUrls: ['./validate-lpz-form.component.scss']
})
/**
 * @deprecated Use ValidateLpzFormComponent from @de-care/domains/identification/ui-validate-lpz-form
 */
export class ValidateLpzFormComponent implements OnInit, VerifyLPZFormComponentApi {
    @Input() lpzInfo: AccountVerify;
    @Output() verified = new EventEmitter();
    @Output() invalidUserInfo = new EventEmitter();

    validationError = false;
    frmLastNameId = uuid();
    frmPhoneId = uuid();
    frmZipId = uuid();
    currentLang: SxmLanguages;
    validateLpzForm: FormGroup;
    submitted = false;
    loading = false;
    isCanada = false;

    @ViewChild('ngForm', { static: true }) public ngForm: NgForm;

    controlIsInvalid: (control: AbstractControl) => boolean = controlIsInvalid(() => {
        return this.submitted;
    });

    constructor(
        private _formBuilder: FormBuilder,
        private _translateService: TranslateService,
        private _dataLayerService: DataLayerService,
        private _dataAccountService: DataAccountService,
        private _settingsService: SettingsService
    ) {}

    ngOnInit() {
        this.currentLang = this._translateService.currentLang as SxmLanguages;
        this.isCanada = this._settingsService.isCanadaMode;
        this.validateLpzForm = this._formBuilder.group({
            lastName: ['', getSxmValidator('lastName', this._settingsService.settings.country, this.currentLang)],
            phoneNumber: this._formBuilder.control('', {
                updateOn: 'blur'
            }), //validated by custom phoneNumber directive
            zipCode: this._formBuilder.control('', {
                validators: getSxmValidator('zipCode', this._settingsService.settings.country, this.currentLang),
                updateOn: 'blur'
            })
        });

        if (this.lpzInfo) {
            this.validateLpzForm.get('lastName').setValue(this.lpzInfo.lastName);
            this.validateLpzForm.get('phoneNumber').setValue(this.lpzInfo.phoneNumber);
            this.validateLpzForm.get('zipCode').setValue(this.lpzInfo.zipCode);
        }
    }

    onSubmit() {
        this.submitted = true;
        if (this.validateLpzForm.valid) {
            this.loading = true;
            const accountData: AccountVerify = this.validateLpzForm.value;
            this._dataAccountService.verify(accountData).subscribe(
                response => {
                    this.validationError = !response;
                    if (response) {
                        this.verified.emit();
                    } else {
                        this.loading = false;
                        this.invalidUserInfo.emit();
                    }
                    this._dataLayerService.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.EventFailedActVerify));
                },
                error => {
                    this.validationError = true;
                    this.loading = false;
                    this._dataLayerService.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.EventFailedActVerify));
                }
            );
        } else {
            if (this.validateLpzForm.controls.lastName.errors) {
                this._dataLayerService.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.IdentMissingLastName));
            }
            if (this.validateLpzForm.controls.phoneNumber.errors) {
                this._dataLayerService.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.IdentMissingPhone));
            }
            if (this.validateLpzForm.controls.zipCode.errors) {
                this._dataLayerService.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.IdentMissingZipCode));
            }
        }
    }

    clearForm() {
        this.validateLpzForm.reset();
        this.submitted = false;
    }
}
