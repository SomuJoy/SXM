import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { controlIsInvalid, getSxmValidator } from '@de-care/shared/validation';
import { Subject } from 'rxjs';
import * as uuid from 'uuid/v4';

export interface ProvinceList {
    key: string;
    label: string;
}

@Component({
    selector: 'de-care-province-selector',
    templateUrl: './province-selector.component.html',
    styleUrls: ['./province-selector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProvinceSelectorComponent implements OnInit, OnDestroy, OnChanges {
    provinceSelectorForm: FormGroup;
    submitted = false;
    serviceAddressFound = false;
    private readonly _unsubscribe: Subject<void> = new Subject();
    private _provinceKey: string;

    @Input() selectedProvince: string;
    @Input() provinces: ProvinceList[];
    @Input() ariaDescribedbyTextId = uuid();

    @Output() provinceSelected = new EventEmitter();
    @Output() ipLocationNotFound = new EventEmitter();
    @Output() userChangedProvince: EventEmitter<string | void> = new EventEmitter();

    controlIsInvalid: (control: AbstractControl) => boolean = controlIsInvalid(() => {
        return this.submitted;
    });

    constructor(private readonly _formBuilder: FormBuilder) {}

    ngOnInit() {
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
        if (this.provinceSelectorForm.valid) {
            this.submitted = true;
            this.userChangedProvince.emit(this.provinceSelectorForm.controls.province.value);
        }
    }

    initValue(value) {
        this.provinceSelectorForm.controls.province.patchValue(value, { emitEvent: false });
        this._provinceKey = value;
    }

    onListChanged() {
        this.provinceSelectorForm.controls.province.patchValue(this._provinceKey, { emitEvent: false });
    }
}
