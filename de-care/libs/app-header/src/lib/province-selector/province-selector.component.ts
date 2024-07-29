import { Component, OnInit, Output, EventEmitter, OnDestroy, Input, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { map, filter, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { getSxmValidator, controlIsInvalid } from '@de-care/shared/validation';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { DataUtilityService } from '@de-care/data-services';
import { Store } from '@ngrx/store';
import * as uuid from 'uuid/v4';

interface Province {
    key: string;
    label: string;
}

@Component({
    selector: 'province-selector',
    templateUrl: './province-selector.component.html',
    styleUrls: ['./province-selector.component.scss']
})
export class ProvinceSelectorComponent implements OnInit, OnDestroy, OnChanges {
    provinceSelectorForm: FormGroup;
    submitted = false;
    serviceAddressFound = false;
    provinces$: Observable<{ label: string; key: string }>;
    private _unsubscribe: Subject<void> = new Subject();
    private _provinceKey: string;

    @Input() selectedProvince: string;
    @Input() ariaDescribedbyTextId = uuid();

    @Output() provinceSelected = new EventEmitter();
    @Output() ipLocationNotFound = new EventEmitter();
    @Output() userChangedProvince: EventEmitter<string | void> = new EventEmitter();

    controlIsInvalid: (control: AbstractControl) => boolean = controlIsInvalid(() => {
        return this.submitted;
    });

    constructor(
        private _formBuilder: FormBuilder,
        private _translateService: TranslateService,
        private _settingsService: SettingsService,
        private _dataUtilityService: DataUtilityService,
        private _store: Store<any>,
        public userSettingsService: UserSettingsService
    ) {}

    ngOnInit() {
        //update dropdownlist when language changes
        this.provinces$ = this._translateService.stream(`app.areas`).pipe(
            takeUntil(this._unsubscribe),
            filter(() => this._settingsService.isCanadaMode),
            map(values => {
                return values.sort(this._sortProvincesByName);
            })
        );

        this.provinceSelectorForm = this._formBuilder.group({
            province: [null, getSxmValidator('province', 'ca', 'en-CA')]
        });

        !this._provinceKey && this.selectedProvince && this.initValue(this.selectedProvince);
    }

    ngOnDestroy() {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    ngOnChanges() {
        if (this.selectedProvince && this.provinceSelectorForm) {
            this.initValue(this.selectedProvince);
        }
    }

    submit() {
        this.selectProvince(this.provinceSelectorForm.controls.province.value);
        this.userChangedProvince.emit(this.provinceSelectorForm.controls.province.value);
    }

    selectProvince(val: string) {
        this.submitted = true;
        if (this.provinceSelectorForm.valid) {
            this.userSettingsService.setSelectedCanadianProvince(val.toUpperCase());
            this.provinceSelected.emit(this._getLabelFromKey(val.toUpperCase()));
        }
    }

    initValue(value) {
        this.provinceSelectorForm.controls.province.patchValue(value, { emitEvent: false });
        this.selectProvince(value);
        this._provinceKey = value;
    }

    onListChanged() {
        this.provinceSelectorForm.controls.province.patchValue(this._provinceKey, { emitEvent: false });
    }

    private _getLabelFromKey(key: string): string | null {
        const selectedProvince = this._translateService.instant(`app.areas`).find(prov => prov.key === key.toUpperCase());
        return (selectedProvince && selectedProvince.label) || null;
    }

    private _sortProvincesByName(prev: Province, next: Province): number {
        return prev.label.localeCompare(next.label);
    }
}
