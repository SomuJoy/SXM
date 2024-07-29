import { Component, OnInit, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import * as uuid from 'uuid/v4';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, FormControl } from '@angular/forms';
import { SharedEventTrackService } from '@de-care/data-layer';
import { SettingsService } from '@de-care/settings';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

@Component({
    selector: 'sxm-ui-retain-invoice-billing-charge-agreement',
    templateUrl: './retain-invoice-billing-charge-agreement.component.html',
    styleUrls: ['./retain-invoice-billing-charge-agreement.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RetainInvoiceBillingChargeAgreementComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => RetainInvoiceBillingChargeAgreementComponent),
            multi: true,
        },
    ],
})
export class RetainInvoiceBillingChargeAgreementComponent implements OnInit, ControlValueAccessor, Validator {
    uniqueId: string = uuid();
    currentLang: string = 'en';
    private _checked: boolean = false;

    trackCheckAction: string = 'charge-agreement-check';
    trackComponentName: string = 'charge-agreement';
    copyPart1aKey = 'part1a';
    copyPart3aKey = 'part3';
    showChangeLanguageLink = true;

    copyPartCardAgreement = 'text';

    @Output() checkChange = new EventEmitter<boolean>();

    translateKeyPrefix = 'DeCareUseCasesTransferFeatureACSCTargetedModule.RetainInvoiceBillingChargeAgreement.';

    @Input() set checked(value: boolean) {
        this._checked = value;
        this.onTouchedCallback && this.onTouchedCallback();
        this.onChangeCallback && this.onChangeCallback(this._checked);

        this.checkChange.emit(this._checked);

        this._eventTrackService.track(this.trackCheckAction, { componentName: this.trackComponentName, checked: this._checked });
    }

    get checked() {
        return this._checked;
    }

    private onTouchedCallback: () => void;
    private onChangeCallback: (_: any) => void;

    constructor(private _eventTrackService: SharedEventTrackService, public settingsService: SettingsService, private readonly _translateService: TranslateService) {}

    ngOnInit() {
        if (this.settingsService.isCanadaMode) {
            this.showChangeLanguageLink = false;
        }
    }

    writeValue(value: boolean) {
        this._checked = value;
    }

    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    changeLanguage($event: Event) {
        $event.preventDefault();
        this._translateService
            .get(`${this.translateKeyPrefix}${this.currentLang}.LANGUAGE_LINK`)
            .pipe(take(1))
            .subscribe((value) => {
                this.currentLang = value;
            });
    }

    validate(c: FormControl) {
        if (this._checked) {
            return null;
        } else {
            return {
                ChargeAgreement: {
                    valid: false,
                },
            };
        }
    }
}
