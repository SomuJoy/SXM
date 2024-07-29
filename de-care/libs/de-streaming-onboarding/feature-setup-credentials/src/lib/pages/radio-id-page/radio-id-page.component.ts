import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FindAccountByRadioIdOrVinWorkflowService, backToWelcome, getAccountIsInPreTrial } from '@de-care/de-streaming-onboarding/state-setup-credentials';
import { behaviorEventErrorsFromUserInteraction, behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { getSxmValidator } from '@de-care/shared/validation';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { getFeatureFlagIapEnableContactUsTelephone } from '@de-care/shared/state-feature-flags';
@Component({
    selector: 'de-streaming-onboarding-radio-id-page',
    templateUrl: './radio-id-page.component.html',
    styleUrls: ['./radio-id-page.component.scss'],
})
export class RadioIdPageComponent implements OnInit, AfterViewInit {
    @ViewChild('FindingRadioIDModal') private readonly _FindingRadioIDModal: SxmUiModalComponent;
    translateKeyPrefix = 'DeStreamingOnboardingFeatureSetupCredentialsModule.RadioIdPageComponent.';
    RadioIDform: FormGroup;
    loading$ = new BehaviorSubject<boolean>(false);
    showRadioIdError = false;
    showSystemError = false;
    contactUsTelephoneEnabled$ = this._store.pipe(select(getFeatureFlagIapEnableContactUsTelephone));

    constructor(
        private _formBuilder: FormBuilder,
        private readonly _store: Store,
        private readonly _findAccountByRadioIdOrVinWorkflowService: FindAccountByRadioIdOrVinWorkflowService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.RadioIDform = this._formBuilder.group({
            radioID: [
                '',
                {
                    validators: getSxmValidator('radioIdOrVin'),
                    updateOn: 'blur',
                },
            ],
        });
    }
    ngAfterViewInit(): void {
        this._dispatchImpressionForComponent();
    }
    openFindRadioIdModal() {
        this._FindingRadioIDModal.open();
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'overlay:howdoifindmyradioid' }));
    }

    handleModalClosed() {
        this._dispatchImpressionForComponent();
    }

    onkeyup() {
        this.showSystemError = false;
        this.showRadioIdError = false;
    }

    private _dispatchImpressionForComponent(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'enterrid' }));
    }

    onSubmit() {
        this.showRadioIdError = false;
        this.showSystemError = false;
        this.RadioIDform.markAllAsTouched();
        if (this.RadioIDform.valid) {
            this.loading$.next(true);
            this._findAccountByRadioIdOrVinWorkflowService
                .build({ identifierToLookupWith: this.RadioIDform.value.radioID })
                .pipe(withLatestFrom(this._store.pipe(select(getAccountIsInPreTrial))))
                .subscribe({
                    next: ([data, isInPreTrial]) => {
                        if (isInPreTrial) {
                            this._router.navigate(['../registration'], { relativeTo: this._activatedRoute }).then(() => {
                                this.loading$.next(false);
                            });
                            return;
                        }
                        if (!data) {
                            this.showRadioIdError = true;
                        }
                        this.loading$.next(false);
                    },
                    error: (error) => {
                        if (error.error && error.error.error) {
                            const errorResponse = error.error.error;
                            if (errorResponse.fieldErrors) {
                                if (errorResponse.fieldErrors[0].errorType === 'BUSINESS') {
                                    this.showRadioIdError = true;
                                } else if (errorResponse.fieldErrors[0].errorType === 'SYSTEM') {
                                    this.showSystemError = true;
                                }
                            } else {
                                this.showSystemError = true;
                            }
                        } else if (error?.errorType === 'RADIO_NOT_ACTIVE') {
                            this.showRadioIdError = true;
                        } else if (error.status === 400) {
                            this.showSystemError = true;
                        } else if (!error?.errorType) {
                            this.showRadioIdError = true;
                        }
                        this.loading$.next(false);
                    },
                    complete: () => {
                        this.loading$.next(false);
                    },
                });
        } else {
            const errors = [];
            if (this.RadioIDform.controls.radioID.hasError('invalidRadioIdOrVin')) {
                errors.push('Auth - Missing or invalid radio ID/VIN');
            }
            if (errors.length > 0) {
                this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors }));
            }
        }
    }
    onPreviewClick() {
        this._store.dispatch(backToWelcome());
    }
}
