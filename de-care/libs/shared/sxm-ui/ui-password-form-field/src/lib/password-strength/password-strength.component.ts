import { DOCUMENT } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter, Injector, AfterViewInit, Inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, Validator, AbstractControl, ValidationErrors, Validators, NgControl } from '@angular/forms';
import { BehaviorSubject, fromEvent, Subject, timer } from 'rxjs';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { generatePasswordRules, PasswordRules } from './password-rules.helper';

@Component({
    selector: 'sxm-ui-password-strength',
    templateUrl: './password-strength.component.html',
    styleUrls: ['./password-strength.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SxmUiPasswordStrengthComponent,
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: SxmUiPasswordStrengthComponent,
            multi: true,
        },
    ],
})
export class SxmUiPasswordStrengthComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor, Validator {
    private _value: string;
    private _hintToggleEnabled = true;
    private _reservedWords?: string[];
    private _passwordGenericError?: boolean;
    private _control: AbstractControl;
    private _onTouchedCallback: () => void;
    private _onChangeCallback: (_: any) => void;
    private destroy$ = new Subject<boolean>();

    @Input() id: string;
    @Input() labelText: string;
    @Input() qatagName: string;
    @Input() set reservedWords(reservedWords: string[] | null) {
        if (reservedWords && reservedWords.length > 0) {
            this._reservedWords = reservedWords;
            this._onTouchedCallback && this._onTouchedCallback();
            this._onChangeCallback && this._onChangeCallback(this.value);
            // Note: We want to force validation here even if the use of this control is set to update onBlur
            //       because we are receiving a value (reservedWords) with the intent of showing validation.
            if (this._control) {
                this._control.updateValueAndValidity({ emitEvent: false, onlySelf: true });
            }
        }
    }

    @Input() set passwordGenericError(passwordGenericError: boolean | false) {
        if (passwordGenericError) {
            this._passwordGenericError = passwordGenericError;
            this._onTouchedCallback && this._onTouchedCallback();
            this._onChangeCallback && this._onChangeCallback(this.value);
            // Note: We want to force validation here even if the use of this control is set to update onBlur
            //       because we are receiving a value (reservedWords) with the intent of showing validation.
            if (this._control) {
                this._control.updateValueAndValidity({ emitEvent: false, onlySelf: true });
            }
        }
    }

    @Input() hidePasswordHintFeature = false;

    @Input() set alwaysDisplayPasswordHint(value) {
        if (this.hidePasswordHintFeature) {
            return;
        }

        this._hintToggleEnabled = !value;

        if (value === true) {
            this.displayPasswordHint = true;
        }
    }

    @Input() newPassword = false;

    @Output() hintToggled = new EventEmitter<boolean>();

    displayPasswordHint: boolean = false;

    rules: PasswordRules = generatePasswordRules('');

    get value() {
        return this._value;
    }
    // TODO: consider finding a way to stop repeat capture of holding key down (I think it's a product of using ngModel 2 way binding)
    set value(password) {
        this._value = password;
        if (password !== null) {
            this.setupPasswordRules();
        }
        this._onChangeCallback && this._onChangeCallback(password);
    }

    private readonly _window;
    private readonly _windowHasBeenClicked$ = new BehaviorSubject(false);

    constructor(private _injector: Injector, @Inject(DOCUMENT) document: Document, private readonly _changeDetectionRef: ChangeDetectorRef) {
        this._window = document.defaultView;
    }

    ngOnInit(): void {
        this.setupPasswordRules();

        this._windowHasBeenClicked$
            .pipe(
                takeUntil(this.destroy$),
                filter(Boolean),
                switchMap(() => {
                    return timer(0).pipe(tap(() => this._windowHasBeenClicked$.next(false)));
                })
            )
            .subscribe();

        fromEvent(this._window, 'click')
            .pipe(
                takeUntil(this.destroy$),
                tap(() => this._windowHasBeenClicked$.next(true))
            )
            .subscribe();
    }

    ngAfterViewInit(): void {
        // TODO: This method is not recommended any more; the preference is to
        // inject NgControl and
        // `ngControl.valueAccessor = this` in the constructor
        this._control = this._injector.get(NgControl).control; // tslint:disable-line deprecation
    }

    writeValue(value: string): void {
        this.value = value;
    }

    registerOnChange(fn: any): void {
        this._onChangeCallback = fn;
    }

    registerOnTouched(fn: any): void {
        this._onTouchedCallback = fn;
    }

    validate(control: AbstractControl): ValidationErrors {
        const requiredError = Validators.required(control);
        if (requiredError) {
            return requiredError;
        }
        const minLengthError = Validators.minLength(8)(control);
        const maxLengthError = Validators.maxLength(20)(control);
        if (minLengthError || maxLengthError) {
            return {
                length: {
                    min: 8,
                    max: 20,
                },
            };
        }
        const policyError = Object.values(this.rules.secondary).filter((i) => i).length < 3;
        if (policyError) {
            return {
                policy: true,
            };
        }
        if (this._passwordGenericError) {
            return {
                generic: true,
            };
        }
        if (this._reservedWords && this._reservedWords.length > 0 && this._reservedWords.some((word) => control.value.toLowerCase().indexOf(word) > -1)) {
            return {
                reservedWords: {
                    words: [...this._reservedWords],
                },
            };
        }
        return null;
    }

    onFocus(): void {
        if (this.hidePasswordHintFeature) {
            this._windowHasBeenClicked$
                .pipe(
                    filter(Boolean),
                    take(1),
                    tap(() => {
                        this.displayPasswordHint = true;
                        this.hintToggled.emit(true);
                        this._changeDetectionRef.markForCheck();
                    })
                )
                .subscribe();

            return;
        }

        if (this._hintToggleEnabled) {
            this.displayPasswordHint = true;
            this.hintToggled.emit(true);
        }
    }

    onBlur(): void {
        this._onTouchedCallback && this._onTouchedCallback();

        if (this.hidePasswordHintFeature) {
            this._windowHasBeenClicked$
                .pipe(
                    filter(Boolean),
                    take(1),
                    tap(() => {
                        this.displayPasswordHint = false;
                        this.hintToggled.emit(false);
                        this._changeDetectionRef.markForCheck();
                    })
                )
                .subscribe();
            return;
        }

        if (this._hintToggleEnabled) {
            this.displayPasswordHint = false;
            this.hintToggled.emit(false);
        }
    }

    private setupPasswordRules() {
        if (this._value) {
            const rules = generatePasswordRules(this._value);

            this.rules = rules;
        } else {
            this._resetStrength();
        }
    }

    private _resetStrength() {
        this.rules = generatePasswordRules('');
    }

    hidePasswordHint() {
        this.displayPasswordHint = false;
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
