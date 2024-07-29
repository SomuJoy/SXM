import { AfterViewChecked, AfterViewInit, Component, EventEmitter, Injector, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import { getSxmValidator } from '@de-care/shared/validation';
import { fromEvent, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as uuid from 'uuid/v4';

@Component({
    selector: 'credit-card-number-input',
    templateUrl: './credit-card-number-input.component.html',
    styleUrls: ['./credit-card-number-input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: CreditCardNumberInputComponent,
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: CreditCardNumberInputComponent,
            multi: true
        }
    ]
})
export class CreditCardNumberInputComponent extends ControlValueAccessorConnector implements OnDestroy, AfterViewInit, AfterViewChecked, ControlValueAccessor, Validator {
    @Input() labelText: string;
    @Input() set isMasked(value) {
        this.masked = value;
        if (this.masked) {
            this._sub = null;
        } else if (this.fieldElement) {
            this._sub = fromEvent(this.fieldElement.nativeElement, 'blur')
                .pipe(
                    tap(_ => {
                        this._hasBlurred = true;
                        this.onChange(this._val);
                        this.onTouched && this.onTouched();
                    })
                )
                .subscribe();
        }
    }
    @Input() maskedNum: string;
    @Input() errorMsg: string;
    @ViewChild('field') fieldElement;

    @Output() unmask = new EventEmitter();
    @Output() cardEntryEvent: EventEmitter<any> = new EventEmitter<any>();

    masked = false;
    invalid = false;
    isGiftCardEntered = false;
    private _val = '';
    set value(val: string) {
        if (val !== undefined && this._val !== val) {
            this._val = val;
            this.onChange(val);
            this.onTouched(val);
        }
    }
    get value(): string {
        return this._val;
    }
    readonly ccNumID = uuid();
    readonly ccNumMaskedID = uuid();
    private _sub: Subscription;
    private _hasBlurred = false;
    private _ccMaskedCleared = false;

    constructor(injector: Injector) {
        super(injector);
    }

    checkGiftCardHandler($event) {
        this.isGiftCardEntered = $event.isGiftCard;
        this.cardEntryEvent.emit({ isGiftCard: this.isGiftCardEntered });
    }

    ngAfterViewInit() {
        this.isMasked = this.masked;
    }

    ngAfterViewChecked(): void {
        if (this._ccMaskedCleared && this.fieldElement) {
            if (this.fieldElement.nativeElement) {
                this.fieldElement.nativeElement.focus();
            }
            this._ccMaskedCleared = false;
        }
    }

    onTouched: any = () => {};
    onChange: any = () => {};

    clearInput(): void {
        this._ccMaskedCleared = true;
        this.unmask.emit();
    }

    validate(control: AbstractControl): ValidationErrors {
        if ((control.pristine && this._hasBlurred) || (!this._hasBlurred && !control.touched)) {
            this.invalid = false;
            return null;
        }
        const validation = Validators.compose(getSxmValidator('creditCardNumber'))(control);
        this.invalid = !this.masked && validation !== null;
        return validation;
    }

    writeValue(val: any): void {
        this.value = val;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    ngOnDestroy(): void {
        if (this._sub) {
            this._sub.unsubscribe();
        }
    }
}
