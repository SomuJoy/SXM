import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
    behaviorEventImpressionForComponent,
    behaviorEventErrorFromUserInteraction,
    behaviorEventReactionPromoCodeValidationSuccess,
    behaviorEventReactionPromoCodeValidationFailure,
} from '@de-care/shared/state-behavior-events';
import { ValidatePromoCodeWorkflowService } from '@de-care/domains/offers/state-promo-code';
import { getSxmValidator } from '@de-care/shared/validation';
import { Store } from '@ngrx/store';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

type PromoCodeValidationErrors = 'DEFAULT' | 'INVALID' | 'REDEEMED' | 'EXPIRED';

export type PromoCodeValidationComponentApi = {
    setProcessingCompleted: () => void;
};

@Component({
    selector: 'promo-code-validation',
    templateUrl: './promo-code-validation.component.html',
    styleUrls: ['./promo-code-validation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromoCodeValidationComponent implements OnInit {
    private promoCodeChangedSubs$: Subscription;
    private readonly _formSent$ = new BehaviorSubject<boolean>(false);
    private readonly _errorKey$ = new BehaviorSubject<PromoCodeValidationErrors>(null);

    readonly translateKey = 'domainsOffersUiPromoCodeValidationFormModule.promoCodeValidationComponent.';
    promoCodeValidationFormGroup: FormGroup;
    private readonly _componentName = 'promoCodeEntry';

    displayErrorKey$ = this._formSent$.pipe(
        switchMap((formSent) => {
            if (formSent) {
                return this._errorKey$;
            }
            return of(null);
        })
    );
    loading$ = new BehaviorSubject<boolean>(false);

    @Output() validPromoCode = new EventEmitter<string>();
    @Output() invalidPromoCode = new EventEmitter<string>();
    @Input() isStreaming = true;
    @Input() otherOffersUrl: string;

    constructor(
        private readonly _formBuilder: FormBuilder,
        private readonly _store: Store,
        private readonly _validatePromoCodeWorkflowService: ValidatePromoCodeWorkflowService
    ) {}

    ngOnInit() {
        this._initPromoCodeValidationFormGroup();
    }

    ngAfterViewInit() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: this._componentName }));
    }

    setProcessingCompleted() {
        this.loading$.next(false);
    }

    onContinueClick() {
        this._formSent$.next(true);
        this.loading$.next(true);
        if (this.promoCodeValidationFormGroup.valid) {
            const marketingPromoCode = this.promoCodeValidationFormGroup.value.promoCode;
            this._validatePromoCodeWorkflowService
                .build({
                    marketingPromoCode,
                    streaming: this.isStreaming,
                })
                .subscribe((data) => {
                    switch (data?.status) {
                        case 'VALID':
                            this.validPromoCode.next(marketingPromoCode);
                            this._store.dispatch(behaviorEventReactionPromoCodeValidationSuccess({ componentName: this._componentName }));
                            break;
                        default:
                            this._handlePromoCodeFieldChange();
                            this._store.dispatch(behaviorEventReactionPromoCodeValidationFailure({ componentName: this._componentName }));
                            this._errorKey$.next(data.status);
                            this.invalidPromoCode.next(marketingPromoCode);
                    }
                });
        } else {
            this._errorKey$.next('DEFAULT');
            this._handlePromoCodeFieldChange();
            this._store.dispatch(behaviorEventErrorFromUserInteraction({ message: 'Promo Code Validation - Blank promo code' }));
            this.loading$.next(false);
        }
    }

    private _handlePromoCodeFieldChange() {
        if (!this.promoCodeChangedSubs$) {
            this.promoCodeChangedSubs$ = this.promoCodeValidationFormGroup
                .get('promoCode')
                .valueChanges.pipe(
                    take(1),
                    tap(() => {
                        this._formSent$.next(false);
                        this._errorKey$.next(null);
                        this.promoCodeChangedSubs$ = null;
                    })
                )
                .subscribe();
        }
    }

    private _initPromoCodeValidationFormGroup() {
        this.promoCodeValidationFormGroup = this._formBuilder.group({
            promoCode: new FormControl(null, {
                validators: getSxmValidator('promoCode'),
                updateOn: 'blur',
            }),
        });
    }
}
