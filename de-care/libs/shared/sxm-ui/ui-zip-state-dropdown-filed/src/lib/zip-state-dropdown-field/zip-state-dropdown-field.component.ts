import { Component, Inject, Injector, OnInit, OnDestroy, Input } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { SettingsService } from '@de-care/settings';
import { FormGroupControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { ZIP_BASED_STATE_LOOKUP, ZipBasedStateLookup } from '../token';
import { StateData } from '../zip-state-list-lookup.service';
import { getSxmValidator, controlIsInvalid } from '@de-care/shared/forms-validation';
import { SxmLanguages } from '@de-care/shared/translation';
import { TranslateService } from '@ngx-translate/core';
import * as uuid from 'uuid/v4';

@Component({
    selector: 'sxm-ui-zip-state-dropdown-field',
    templateUrl: './zip-state-dropdown-field.component.html',
    styleUrls: ['./zip-state-dropdown-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SxmUiZipStateDropdownFieldComponent,
            multi: true,
        },
    ],
})
export class SxmUiZipStateDropdownFieldComponent extends FormGroupControlValueAccessorConnector implements OnInit, OnDestroy {
    translateKeyPrefix = 'SharedSxmUiUiZipStateDropdownFiledModule.SxmUiZipStateDropdownFieldComponent.';
    showStateList = false;
    stateList: StateData[];
    currentLang: SxmLanguages;
    zipId = uuid();
    stateId = uuid();
    private _unsubscribe$: Subject<void> = new Subject();

    controlIsInvalid = controlIsInvalid(() => {
        return this.submitted;
    });

    @Input() submitted: false;

    constructor(
        @Inject(ZIP_BASED_STATE_LOOKUP) private readonly zipBasedStateLookup: ZipBasedStateLookup,
        injector: Injector,
        public settingsService: SettingsService,
        private translate: TranslateService
    ) {
        super(injector);
    }

    static setZipStateControls(form: FormGroup) {
        form.addControl('zip', new FormControl(null, { updateOn: 'blur', validators: [Validators.required] }));
        form.addControl('state', new FormControl(null, { updateOn: 'blur' }));
    }

    ngOnInit(): void {
        this.formGroup && SxmUiZipStateDropdownFieldComponent.setZipStateControls(this.formGroup);
        this.formGroup.get('zip').setValidators(getSxmValidator('zipCode', this.settingsService.settings.country, this.currentLang));
        this.formGroup
            .get('zip')
            .valueChanges.pipe(
                map((zipValue) => this._findState(zipValue)),
                tap(() => {
                    this.showStateList = false;
                    this.formGroup.get('state').removeValidators(Validators.required);
                }),
                tap(() => this.formGroup.get('state').value && this.formGroup.get('state').setValue(null)),
                tap(() => this.formGroup.get('state').disable()),
                filter((states) => states?.length > 1)
            )
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((states) => {
                this.showStateList = true;
                this.stateList = states;
                if (states) {
                    this.formGroup.get('state').enable();
                    this.formGroup.get('state').addValidators(Validators.required);
                }
            });
        this.currentLang = this.translate.currentLang as SxmLanguages;
    }

    ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    private _findState(zip: string) {
        return this.zipBasedStateLookup.getState(zip);
    }
}
