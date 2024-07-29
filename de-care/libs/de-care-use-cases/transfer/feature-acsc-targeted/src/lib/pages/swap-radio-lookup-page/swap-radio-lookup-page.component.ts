import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import {
    getDefaultMode,
    getTransferFromInfoForSwap,
    SwapRadioLookupSubmitWorkflowService,
    getShowSwapChat,
    SwapRadioLookupSubmitWorkflowServiceErrors,
} from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';
import { Router, ActivatedRoute } from '@angular/router';
import { SxmValidators } from '@de-care/shared/forms-validation';
import { take, withLatestFrom, takeUntil } from 'rxjs/operators';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import * as uuid from 'uuid/v4';

enum ErrorEnum {
    NOT_CAPABLE = 'NOT_CAPABLE',
    LIFETIME = 'LIFETIME',
    SAME_ACCOUNT = 'SAME_ACCOUNT',
    OTHER = 'OTHER',
    INVALID_RADIO = 'INVALID_RADIO',
    INVALID_VIN = 'INVALID_VIN',
    NOT_FOUND_VIN = 'NOT_FOUND_VIN',
}

@Component({
    selector: 'de-care-swap-radio-lookup-page',
    templateUrl: './swap-radio-lookup-page.component.html',
    styleUrls: ['./swap-radio-lookup-page.component.scss'],
})
export class SwapRadioLookupPageComponent implements OnInit, OnDestroy {
    translateKeyPrefix = 'DeCareUseCasesTransferFeatureACSCTargetedModule.SwapRadioLookupPageComponent.';
    private _unsubscribe: Subject<void> = new Subject();
    form: FormGroup;
    submitted = false;
    isProcessingRadioLookup = false;
    errorCode: ErrorEnum;
    get ErrorEnum() {
        return ErrorEnum;
    }
    showError = false;
    showChat: boolean;
    deviceHelpModalAriaDescribedbyTextId = uuid();

    transferFromData$ = this._store.pipe(select(getTransferFromInfoForSwap));

    constructor(
        private readonly _store: Store,
        private readonly _fb: FormBuilder,
        private readonly _swapRadioLookupSubmitWorkflowService: SwapRadioLookupSubmitWorkflowService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _sxmValidators: SxmValidators
    ) {}

    ngOnInit(): void {
        this.form = this._fb.group({
            radioId: ['', { validators: this._sxmValidators.radioIdOrVin, updateOn: 'blur' }],
        });
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'swap', componentKey: 'router' }));

        this._store.pipe(select(getShowSwapChat), takeUntil(this._unsubscribe)).subscribe((showSwapChat) => (this.showChat = showSwapChat));
    }

    ngOnDestroy() {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    submitForm(): void {
        this.submitted = true;
        this.showError = false;
        this.isProcessingRadioLookup = true;
        if (this.form.valid) {
            this._swapRadioLookupSubmitWorkflowService
                .build(this.form.value.radioId)
                .pipe(take(1), withLatestFrom(this._store.pipe(select(getDefaultMode))))
                .subscribe({
                    next: ([result, mode]) => {
                        this.isProcessingRadioLookup = false;
                        if (result === 'CAN_SWAP') {
                            this._router.navigate(['checkout'], { relativeTo: this._activatedRoute });
                        } else if (result === 'REQUIRES_SC') {
                            this._router.navigate(['../'], { relativeTo: this._activatedRoute, queryParams: { mode } }); //maybe add accountNumber
                        } else {
                            this._router.navigate(['/error']);
                        }
                    },
                    error: (err: SwapRadioLookupSubmitWorkflowServiceErrors) => {
                        this.isProcessingRadioLookup = false;
                        switch (err) {
                            case 'NEW_RADIO_LACKS_CAPABILITIES': {
                                this.showError = true;
                                this.errorCode = ErrorEnum.NOT_CAPABLE;
                                break;
                            }
                            case 'NEW_RADIO_ELIGIBLE_FOR_LIFE_TIME_PLAN': {
                                this.showError = true;
                                this.errorCode = ErrorEnum.LIFETIME;
                                break;
                            }
                            case 'ACSC_RADIO_IS_ON_SAME_ACCOUNT': {
                                this.showError = true;
                                this.errorCode = ErrorEnum.SAME_ACCOUNT;
                                break;
                            }
                            case 'INVALID_RADIO':
                                this.showError = true;
                                this.errorCode = ErrorEnum.INVALID_RADIO;
                                break;
                            case 'INVALID_VIN':
                                this.showError = true;
                                this.errorCode = ErrorEnum.INVALID_VIN;
                                break;
                            case 'NOT_FOUND_VIN':
                                this.showError = true;
                                this.errorCode = ErrorEnum.NOT_FOUND_VIN;
                                break;
                            case 'SUBSCRIPTION_HAS_INELIGIBLE_PLAN':
                            case 'DEFAULT':
                            default: {
                                this.showError = true;
                                this.errorCode = ErrorEnum.OTHER;
                            }
                        }
                    },
                });
        } else {
            this.isProcessingRadioLookup = false;
        }
    }

    onRadioIdChange() {
        this.showError = false;
    }
}
