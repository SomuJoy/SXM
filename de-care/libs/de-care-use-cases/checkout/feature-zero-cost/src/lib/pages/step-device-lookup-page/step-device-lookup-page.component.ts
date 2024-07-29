import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { getSelectedOfferViewModel, ValidateDeviceInfoWorkflowErrors, ValidateDeviceInfoWorkflowService } from '@de-care/de-care-use-cases/checkout/state-zero-cost';
import { SxmValidators } from '@de-care/shared/forms-validation';
import { behaviorEventErrorsFromUserInteraction, behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'step-device-lookup-page',
    templateUrl: './step-device-lookup-page.component.html',
    styleUrls: ['./step-device-lookup-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepDeviceLookupPageComponent implements ComponentWithLocale, OnInit, AfterViewInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    viewModel$ = this._store.select(getSelectedOfferViewModel);
    form: FormGroup;
    processing$ = new BehaviorSubject(false);
    unexpectedSubmissionError$ = new BehaviorSubject(false);
    deviceNotEligible = false;

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _store: Store,
        private readonly _formBuilder: FormBuilder,
        private readonly _sxmValidators: SxmValidators,
        private readonly _validateDeviceInfoWorkflowService: ValidateDeviceInfoWorkflowService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute
    ) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {
        // TODO: include submission attempt counter maybe
        this.form = this._formBuilder.group({
            deviceId: ['', { validators: this._sxmValidators.radioIdOrVin, updateOn: 'blur' }],
        });
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'stepdevicelookup' }));
    }

    formSubmit() {
        this.deviceNotEligible = false;
        this.processing$.next(true);
        this.form.markAllAsTouched();
        if (this.form.valid) {
            this._validateDeviceInfoWorkflowService.build(this.form.value.deviceId).subscribe({
                next: () => {
                    this._router.navigate(['../account-info'], { relativeTo: this._activatedRoute, queryParamsHandling: 'preserve' }).then(() => {
                        this.processing$.next(false);
                    });
                },
                error: (error: ValidateDeviceInfoWorkflowErrors) => {
                    this.processing$.next(false);
                    switch (error) {
                        case 'DEVICE_NOT_ELIGIBLE': {
                            this.form.get('deviceId').setErrors({ notEligible: true });
                            this.deviceNotEligible = true;
                            break;
                        }
                        case 'DEVICE_NOT_FOUND': {
                            this.form.get('deviceId').setErrors({ notFound: true });
                            break;
                        }
                        case 'SYSTEM': {
                            break;
                        }
                    }
                },
            });
        } else {
            const errors = [];
            if (this.form.get('deviceId').errors) {
                errors.push('Auth - Missing or invalid RadioID / VIN');
            }
            if (errors.length > 0) {
                this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors }));
            }
            this.processing$.next(false);
        }
    }
}
