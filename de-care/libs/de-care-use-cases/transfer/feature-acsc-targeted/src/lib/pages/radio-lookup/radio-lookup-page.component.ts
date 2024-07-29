import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { FormGroup, FormBuilder } from '@angular/forms';
import { getSxmValidator } from '@de-care/shared/forms-validation';
import { RadioLookupWorkflowService, getDefaultMode, DefaultMode } from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';
import { takeUntil, withLatestFrom, take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import * as uuid from 'uuid/v4';

enum AlertEnum {
    NOT_FOUND = 'notFound',
    CLOSED = 'closed',
    SAME_ACCOUNT = 'sameAccount',
    OTHER = 'other'
}
@Component({
    selector: 'de-care-radio-lookup-page',
    templateUrl: './radio-lookup-page.component.html',
    styleUrls: ['./radio-lookup-page.component.scss']
})
export class RadioLookupPageComponent implements OnInit, AfterViewInit, OnDestroy {
    translateKeyPrefix = 'DeCareUseCasesTransferFeatureACSCTargetedModule.RadioLookupPageComponent.';
    private _unsubscribe: Subject<void> = new Subject();
    form: FormGroup;
    submitted = false;
    isProcessingRadioLookup = false;
    alertCode: AlertEnum;
    showAlert = false;
    get AlertEnum() {
        return AlertEnum;
    }
    deviceHelpModalAriaDescribedbyTextId = uuid();

    constructor(
        private readonly _store: Store,
        private readonly _fb: FormBuilder,
        private readonly _radioLookupWorkflowService: RadioLookupWorkflowService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.form = this._fb.group({
            radioId: ['', { validators: getSxmValidator('radioIdOrVin'), updateOn: 'blur' }]
        });

        this._store.pipe(select(getDefaultMode), takeUntil(this._unsubscribe)).subscribe(mode => {
            if (mode === DefaultMode.SC_ONLY) {
                this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'servicecontinuity', componentKey: 'router' }));
            } else {
                this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'scac', componentKey: 'router' }));
            }
        });
    }

    ngAfterViewInit(): void {
        this._store.dispatch(pageDataFinishedLoading());
    }

    ngOnDestroy() {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    submitForm(): void {
        this.submitted = true;
        this.showAlert = false;
        this.isProcessingRadioLookup = true;
        if (this.form.valid) {
            this._radioLookupWorkflowService
                .build(this.form.value.radioId)
                .pipe(take(1), withLatestFrom(this._store.pipe(select(getDefaultMode))))
                .subscribe({
                    next: ([_, mode]) => {
                        // continue to acsc flow
                        this.isProcessingRadioLookup = false;
                        if (mode) {
                            this._router.navigate(['../'], { relativeTo: this._activatedRoute, queryParams: { mode } });
                        } else {
                            this._router.navigate(['../'], { relativeTo: this._activatedRoute });
                        }
                    },
                    error: err => {
                        this.isProcessingRadioLookup = false;
                        switch (err) {
                            case 'validation': {
                                this.showAlert = true;
                                this.alertCode = AlertEnum.NOT_FOUND;
                                break;
                            }
                            case 'closed': {
                                this.showAlert = true;
                                this.alertCode = AlertEnum.CLOSED;
                                break;
                            }
                            case 'sameAccount': {
                                this.showAlert = true;
                                this.alertCode = AlertEnum.SAME_ACCOUNT;
                                break;
                            }
                            case 'default':
                            default: {
                                this.showAlert = true;
                                this.alertCode = AlertEnum.OTHER;
                            }
                        }
                    }
                });
        } else {
            this.isProcessingRadioLookup = false;
        }
    }
}
