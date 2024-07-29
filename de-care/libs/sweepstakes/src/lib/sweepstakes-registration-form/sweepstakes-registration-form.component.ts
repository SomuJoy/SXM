import { Component, ChangeDetectionStrategy, OnInit, Input, OnDestroy } from '@angular/core';
import * as uuid from 'uuid/v4';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SweepstakesRegistrationFormService } from './sweepstakes-registration-form.service';
import { SweepstakesResponse, SweepstakesSubmitStatus } from '@de-care/data-services';

export interface SweepstakesInfo {
    officialRulesUrl?: string;
    id?: string;
    radioId: string | number;
}

export interface KeyLabel {
    key: string | number;
    label: string | number;
}

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'sweepstakes-registration-form',
    templateUrl: './sweepstakes-registration-form.component.html',
    styleUrls: ['./sweepstakes-registration-form.component.scss'],
    providers: [SweepstakesRegistrationFormService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SweepstakesRegistrationFormComponent implements OnInit, OnDestroy {
    @Input() sweepstakesInfo: SweepstakesInfo;
    rulesAgreementId = uuid();
    monthId = uuid();
    dayId = uuid();
    yearId = uuid();
    sweepstakesForm: FormGroup;
    submitted = false;
    invalidDOB = false;
    days: KeyLabel[];
    years: string[];
    private _destroy$: Subject<void> = new Subject();

    constructor(private _fb: FormBuilder, private _sweepstakesRegistrationFormService: SweepstakesRegistrationFormService) {}

    ngOnInit() {
        this._initForm();
        this.years = this._sweepstakesRegistrationFormService.calcYears();
        this.days = this._sweepstakesRegistrationFormService.calcDays();
    }

    ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
    }

    private _initForm() {
        this.sweepstakesForm = this._fb.group({
            dob: new FormGroup({
                month: new FormControl(null, [Validators.required]),
                day: new FormControl(null, [Validators.required]),
                year: new FormControl(null, [Validators.required])
            }),
            rulesRelease: new FormControl(false, [Validators.requiredTrue])
        });
        this._listenForDaysValue();
    }

    private _listenForDaysValue(): void {
        this.sweepstakesForm.controls['dob']['controls']['month'].valueChanges.pipe(takeUntil(this._destroy$)).subscribe(this._updateDayRange.bind(this));
    }

    private _updateDayRange(month: string) {
        this.days = this._sweepstakesRegistrationFormService.calcDays(this._sweepstakesRegistrationFormService.getDaysInMonth(+month));
    }

    private _handleResponse(response: SweepstakesResponse) {
        if (response.status === SweepstakesSubmitStatus.SUCCESS) {
            // TODO handle success
        } else if (response.status === SweepstakesSubmitStatus.INVALID_DOB) {
            this.invalidDOB = true;
        }
    }

    sweepstakesFormSubmit(form: FormGroup) {
        this.submitted = true;
        const { month, day, year } = form.controls['dob'].value;
        const dob = `${month}/${day}/${year}`;
        if (this.sweepstakesForm.valid) {
            this._sweepstakesRegistrationFormService
                .enterSweepstakes({
                    radioId: this.sweepstakesInfo.radioId.toString(),
                    contestId: this.sweepstakesInfo.id.toString(),
                    dateOfBirth: dob
                })
                .pipe(takeUntil(this._destroy$))
                .subscribe(this._handleResponse.bind(this));
        }
    }
}
