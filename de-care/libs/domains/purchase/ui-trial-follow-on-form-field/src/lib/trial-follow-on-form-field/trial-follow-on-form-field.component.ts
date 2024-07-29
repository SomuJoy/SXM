import { Component, Input, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as uuid from 'uuid/v4';

export interface FollowOnData {
    packageName: string;
    pricePerMonth: number;
}

@Component({
    selector: 'trial-follow-on-form-field',
    templateUrl: './trial-follow-on-form-field.component.html',
    styleUrls: ['./trial-follow-on-form-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: TrialFollowOnFormFieldComponent,
            multi: true
        }
    ]
})
export class TrialFollowOnFormFieldComponent implements OnDestroy, ControlValueAccessor {
    @Input() followOnData: FollowOnData;

    currentLang$ = this._translateService.onLangChange.pipe(map(lang => lang.lang));

    uniqueId: string = uuid();
    translateKey = 'domainsOffersUiTrialFollowOnFormFieldModule.trialFollowOnFormFieldComponent';

    private _val = false;
    private _unsubscribe: Subject<void> = new Subject();

    set value(val: boolean) {
        if (val !== undefined && this._val !== val) {
            this._val = val;
            this.onChange(val);
            this.onTouched(val);
        }
    }

    get value(): boolean {
        return this._val;
    }

    constructor(private _translateService: TranslateService) {}

    ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    onTouched: any = () => {};
    onChange: any = () => {};

    writeValue(val: any): void {
        this.value = val;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
}
