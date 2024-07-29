import { Component, Injector, Input, OnInit, OnDestroy } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UserSettingsService } from '@de-care/settings';
import { FormGroupControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import * as uuid from 'uuid/v4';
import { takeUntil } from 'rxjs/operators';
import { SxmLanguages } from '@de-care/shared/translation';

interface VehicleInfo {
    year?: any;
    make?: any;
    model?: any;
}

interface RadioOption {
    vehicleInfo: VehicleInfo;
    nextCycleOn?: Date;
    packageName: string;
    username: string;
    radioId: string;
    termLength: number;
    closedDate?: string;
    isClosed: boolean;
}

@Component({
    selector: 'sxm-ui-radio-option-card-with-flag-form-field',
    templateUrl: './radio-option-card-with-flag-form-field.component.html',
    styleUrls: ['./radio-option-card-with-flag-form-field.component.scss'],
    providers: [
        {
            multi: true,
            useExisting: RadioOptionCardWithFlagFormFieldComponent,
            provide: NG_VALUE_ACCESSOR
        }
    ]
})
export class RadioOptionCardWithFlagFormFieldComponent extends FormGroupControlValueAccessorConnector implements OnInit, OnDestroy {
    @Input() radioOption: RadioOption;
    @Input() flagName: string;
    @Input() radioName: string;
    @Input() value: string;
    @Input() selectable: boolean = true;
    @Input() hasFooter: boolean = true;
    id: string;
    dateFormat$: Observable<string>;
    locale: string;
    hasVehicleData: boolean;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    translateKeyPrefix = 'sharedSxmUiUiRadioOptionCardWithFlagFormField.radioOptionCardWithFlagFormField.';
    constructor(injector: Injector, private _userSettingsService: UserSettingsService, private _translateService: TranslateService) {
        super(injector);
        this.id = uuid();
    }

    ngOnInit() {
        this.dateFormat$ = this._userSettingsService.dateFormat$;
        this.locale = this._translateService.currentLang;
        const { make, year, model } = this.radioOption.vehicleInfo;
        this.hasVehicleData = make && year && model;

        this._translateService.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(ev => {
            this.locale = ev.lang as SxmLanguages;
        });

        if (this.formGroup) {
            this.formGroup.addControl(this.flagName, new FormControl(null));
            this.formGroup.addControl(this.radioName, new FormControl(null));
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }

    onRadioInputChange() {
        this.formGroup.get(this.flagName).setValue(false);
    }
}
