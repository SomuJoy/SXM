import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { behaviorEventImpressionForPage, behaviorEventErrorsFromUserInteraction } from '@de-care/shared/state-behavior-events';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
    LookupRadioForSwapWorkflowService,
    LookupRadioForSwapWorkflowServiceResults,
    LookupRadioForSwapWorkflowServiceErrors,
    getSwapLookupViewModel,
} from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { getSxmValidator } from '@de-care/shared/forms-validation';

@Component({
    selector: 'de-care-swap-lookup-page',
    templateUrl: './swap-lookup-page.component.html',
    styleUrls: ['./swap-lookup-page.component.scss'],
})
export class SwapLookupPageComponent implements OnInit, AfterViewInit {
    translateKeyPrefix = 'DeCareUseCasesTransferFeatureACSCTargetedModule.SwapLookupPageComponent.';
    form: FormGroup;
    processing$ = new BehaviorSubject(false);
    viewModel$ = this._store.select(getSwapLookupViewModel);
    showServiceErrorSystem$ = new BehaviorSubject(false);
    showServiceErrorDeviceNotEligible$ = new BehaviorSubject(false);
    showServiceErrorInvalidRadioId$ = new BehaviorSubject(false);
    showServiceErrorInvalidVin$ = new BehaviorSubject(false);

    constructor(
        private readonly _store: Store,
        private readonly _formBuilder: FormBuilder,
        private readonly _lookupRadioForSwapWorkflowService: LookupRadioForSwapWorkflowService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.form = this._formBuilder.group({
            // TODO: add validators required here for the field
            deviceId: ['', { validators: getSxmValidator('radioIdOrVin'), updateOn: 'blur' }],
        });
    }

    ngAfterViewInit(): void {
        this._store.dispatch(pageDataFinishedLoading());
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: '', componentKey: '' }));
    }

    onSubmit() {
        this.form.markAllAsTouched();
        this.showServiceErrorSystem$.next(false);
        this.showServiceErrorDeviceNotEligible$.next(false);
        this.showServiceErrorInvalidRadioId$.next(false);
        this.showServiceErrorInvalidVin$.next(false);
        if (this.form.valid) {
            this._lookupRadioForSwapWorkflowService.build({ deviceId: this.form.value.deviceId }).subscribe({
                next: (result: LookupRadioForSwapWorkflowServiceResults) => {
                    switch (result) {
                        case 'CAN_SWAP': {
                            // Navigate to swap checkout page
                            this._router.navigate(['./checkout'], { relativeTo: this._activatedRoute });
                            break;
                        }
                        case 'REQUIRES_SC': {
                            // TODO: determine what route to use to get to the SC checkout experience
                            //       (also might need to either use some feature state info on the SC side or make use
                            //        of a route query param here to help SC know that it has to present step 1 a bit different)
                            this._router.navigate(['../'], { relativeTo: this._activatedRoute });
                            break;
                        }
                        default: {
                            // NOTE: we are not expecting this to get hit, but if the LookupRadioForSwapWorkflowService.build()
                            //       method happens to return a value we were not expecting then we need to cover that.
                            this._router.navigate(['./error']);
                            break;
                        }
                    }
                },
                error: (error: LookupRadioForSwapWorkflowServiceErrors) => {
                    switch (error) {
                        case 'DEVICE_NOT_SUPPORTED': {
                            this.showServiceErrorDeviceNotEligible$.next(true);
                            break;
                        }
                        case 'INVALID_RADIO_ID': {
                            this.showServiceErrorInvalidRadioId$.next(true);
                            break;
                        }
                        case 'INVALID_VIN': {
                            this.showServiceErrorInvalidVin$.next(true);
                            break;
                        }
                        default: {
                            this.showServiceErrorSystem$.next(true);
                            break;
                        }
                    }
                },
            });
        } else {
            const errors = [];
            if (this.form.controls.deviceId.errors) {
                // TODO: add expected analytics error message string for invalid radioId/vin field for client side validation
                errors.push('');
            }
            if (errors.length > 0) {
                this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors }));
            }
        }
    }
}
