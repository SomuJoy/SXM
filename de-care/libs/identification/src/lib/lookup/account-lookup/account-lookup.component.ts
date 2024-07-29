import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { getSxmValidator } from '@de-care/shared/validation';
import {
    AuthenticationTypeEnum,
    CustomerInfoData,
    DataIdentityService,
    DataLayerDataTypeEnum,
    ErrorTypeEnum,
    IdentityLookupPhoneOrEmailResponseModel
} from '@de-care/data-services';
import { DataLayerService, FrontEndErrorEnum, FrontEndErrorModel } from '@de-care/data-layer';

export interface AccountLookupFormValue {
    email: string;
}

export interface AccountLookupOutput {
    attemptedEmail: string;
    emailValid: boolean;
    accountData: null | IdentityLookupPhoneOrEmailResponseModel[];
}

export interface AccountLookupComponentApi {
    doLookup(email?: string): void;
}

@Component({
    selector: 'account-lookup',
    templateUrl: './account-lookup.component.html',
    styleUrls: ['./account-lookup.component.scss']
})
export class AccountLookupComponent implements OnInit, AccountLookupComponentApi {
    @Input()
    email: string = '';

    isLoading: boolean = false;

    @Output()
    continue: EventEmitter<AccountLookupOutput> = new EventEmitter<AccountLookupOutput>();

    lookupForm: FormGroup;

    serviceErrors: any;

    private _validEmail: boolean = false;

    constructor(
        private _fb: FormBuilder,
        private _dataIdentityService: DataIdentityService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _dataLayerService: DataLayerService
    ) {}

    ngOnInit() {
        this.genForm();
    }

    doLookup(email: string): void {
        this.isLoading = true;
        this._dataIdentityService.lookupCustomerEmail({ email }).subscribe(
            result => {
                this.isLoading = false;
                this._validEmail = true;
                this._logCustomerFoundToDataLayer(email);
                this.continue.emit(<AccountLookupOutput>{
                    attemptedEmail: email,
                    emailValid: this._validEmail,
                    accountData: result
                });
            },
            error => {
                this.serviceErrors = error;
                this.isLoading = false;
                this._validEmail = false;
                this._changeDetectorRef.markForCheck();
            }
        );
    }

    onContinue(): void {
        const formValue = this.lookupForm.value as AccountLookupFormValue;
        this.lookupForm.markAsDirty();
        if (this.lookupForm.valid) {
            this.isLoading = true;
            this._dataIdentityService.lookupCustomerEmail({ email: formValue.email }).subscribe(
                result => {
                    this.isLoading = false;
                    this._validEmail = true;
                    if (this.lookupForm.valid && this._validEmail) {
                        this._logCustomerFoundToDataLayer(formValue.email);
                        this.continue.emit(<AccountLookupOutput>{
                            attemptedEmail: formValue.email,
                            emailValid: this._validEmail,
                            accountData: result
                        });
                    }
                },
                error => {
                    this.serviceErrors = error;
                    this.isLoading = false;
                    this._validEmail = false;
                    this._changeDetectorRef.markForCheck();
                }
            );
        } else {
            if (this.lookupForm.controls.email.errors) {
                this._dataLayerService.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.IdentMissingEmail));
            }
        }
    }

    private genForm() {
        this.lookupForm = this._fb.group({
            email: [this.email, getSxmValidator('emailForLookup')]
        });
    }

    private _logCustomerFoundToDataLayer(email: string): void {
        const customerInfoObj: CustomerInfoData = this._dataLayerService.getData(DataLayerDataTypeEnum.CustomerInfo) || {};
        customerInfoObj.email = email;
        customerInfoObj.authenticationType = AuthenticationTypeEnum.AccountLookup;
        this._dataLayerService.update(DataLayerDataTypeEnum.CustomerInfo, customerInfoObj);
    }
}
