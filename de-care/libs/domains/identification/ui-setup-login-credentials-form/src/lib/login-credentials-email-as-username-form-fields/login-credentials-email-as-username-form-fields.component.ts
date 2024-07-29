import { ChangeDetectorRef, Component, Injector, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DataValidationService } from '@de-care/data-services';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import { getSxmValidator, getValidatePasswordServerFn, getValidateUserNameFromServer } from '@de-care/shared/validation';
import { BehaviorSubject, of, Subject, timer } from 'rxjs';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import * as uuid from 'uuid/v4';

@Component({
    selector: 'login-credentials-email-as-username-form',
    templateUrl: './login-credentials-email-as-username-form-fields.component.html',
    styleUrls: ['./login-credentials-email-as-username-form-fields.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: LoginCredentialsEmailAsUsernameFormFieldsComponent,
            multi: true
        }
    ]
})
export class LoginCredentialsEmailAsUsernameFormFieldsComponent extends ControlValueAccessorConnector implements OnInit, OnChanges, OnDestroy {
    translateKeyPrefix = 'DomainsIdentificationUiSetupLoginCredentialsFormModule.LoginCredentialsEmailAsUsernameFormComponent.';
    reservedWords: string[];
    readonly passwordElementId = uuid();
    @Input() form: FormGroup;
    @Input() submitted = false;
    @Input() isMouseInSubmitButtonZone: 'ENTERED' | 'LEFT';
    @Input() clickedSubmitButton: boolean;
    @Input() submitButtonElementId;

    private destroy$ = new Subject<boolean>();

    isMouseInSubmitButtonZone$ = new BehaviorSubject<'ENTERED' | 'LEFT'>('LEFT');
    passwordStrengthEventsHaveEvaluated$ = new BehaviorSubject<number>(0);
    clickedSubmitButton$ = new Subject<boolean>();
    hasEvaluatedAllEvents$ = new BehaviorSubject<number>(0);

    constructor(
        injector: Injector,
        private readonly _formBuilder: FormBuilder,
        private readonly _dataValidationService: DataValidationService,
        private readonly _changeDetectorRef: ChangeDetectorRef
    ) {
        super(injector);
    }

    ngOnChanges(simpleChanges: SimpleChanges): void {
        simpleChanges?.isMouseInSubmitButtonZone && this.isMouseInSubmitButtonZone$.next(this.isMouseInSubmitButtonZone);
        simpleChanges?.clickedSubmitButton && this.clickedSubmitButton$.next(this.clickedSubmitButton);
    }

    ngOnInit() {
        const usernameControl = new FormControl('', {
            validators: getSxmValidator('emailOrUsername'),
            asyncValidators: [getValidateUserNameFromServer(this._dataValidationService, () => this._changeDetectorRef.markForCheck())],
            updateOn: 'blur'
        });

        const passwordControl = new FormControl(null, {
            validators: getSxmValidator('password'),
            asyncValidators: [getValidatePasswordServerFn(this._dataValidationService, () => this._changeDetectorRef.markForCheck())],
            updateOn: 'blur'
        });

        this.form.addControl('username', usernameControl);
        this.form.addControl('password', passwordControl);

        this._changeDetectorRef.markForCheck();

        this.isMouseInSubmitButtonZone$
            .pipe(
                takeUntil(this.destroy$),
                filter(() => this.form?.controls?.['password']?.untouched),
                switchMap(mouseStatus => {
                    if (mouseStatus === 'ENTERED') {
                        this.passwordStrengthEventsHaveEvaluated$.next(-1);
                        return this.clickedSubmitButton$.pipe(
                            filter(Boolean),
                            switchMap(() => timer(0).pipe(tap(() => this.passwordStrengthEventsHaveEvaluated$.next(1))))
                        );
                    }

                    this.passwordStrengthEventsHaveEvaluated$.next(0);
                    return of(null);
                })
            )
            .subscribe();
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
