import { Directive, forwardRef, OnInit, HostListener, ElementRef, Renderer2, Injector, Inject, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, FormControl, NgControl, Validators, ValidationErrors } from '@angular/forms';
import { getSxmValidator } from '@de-care/shared/validation';
import { DOCUMENT } from '@angular/common';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[appMaskPhoneNumber]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MaskPhoneNumberDirective),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => MaskPhoneNumberDirective),
            multi: true
        }
    ]
})
export class MaskPhoneNumberDirective implements OnInit, ControlValueAccessor, Validator {
    @Input() optional = false;
    private maxNumbers = 10;
    private maxCharacters = 14;
    private formatterRegex = /([\d]{1,3})(([\d]{1,3})?([\d]{1,4})?)?/;
    private unmaskRegex = /[^0-9]/g;
    private onTouchedCallback: () => void;
    private onChangeCallback: (_: any) => void;
    private unmaskedNumber: string;
    private _memoizedInputValue: any;

    constructor(private _injector: Injector, private _renderer: Renderer2, private _elementRef: ElementRef, @Inject(DOCUMENT) private readonly _document: Document) {}

    ngOnInit() {
        this._renderer.setAttribute(this._elementRef.nativeElement, 'length', this.maxNumbers.toString());
        this._renderer.setAttribute(this._elementRef.nativeElement, 'maxlength', this.maxCharacters.toString());
    }

    @HostListener('input', ['$event']) onKeyDown(e: KeyboardEvent) {
        if (!this._memoizedInputValue || this._memoizedInputValue !== this._elementRef.nativeElement.value) {
            this._memoizedInputValue = this._elementRef.nativeElement.value;
            this._maskNumber(this._memoizedInputValue);
            this.onChangeCallback && this.onChangeCallback(this.unmaskedNumber);

            // handles autofill
            if (this._document && this._document.activeElement !== this._elementRef.nativeElement) {
                this.onTouchedCallback();
            }
        }
    }

    @HostListener('blur', ['$event']) hostBlur($event: MouseEvent): void {
        this.onTouchedCallback && this.onTouchedCallback();
    }

    writeValue(value: string | number) {
        if (value !== this.unmaskedNumber) {
            this._maskNumber(value);
            this.onChangeCallback && this.onChangeCallback(this.unmaskedNumber);
            value && this.onTouchedCallback && this.onTouchedCallback();
        }
    }

    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    validate(c: FormControl): ValidationErrors {
        return (this.optional ? Validators.compose(getSxmValidator('optionalPhoneNumber')) : Validators.compose(getSxmValidator('phoneNumber')))(c);
    }

    private parseHelper(match: string, p1: string, p2: string, p3: string, p4: string) {
        let result = '';
        p1 && (result += '(' + p1);
        p3 && (result += ') ' + p3);
        p4 && (result += '-' + p4);
        return result;
    }

    private _maskNumber(value: string | number): void {
        if (value || value === '') {
            this.unmaskedNumber = value.toString().replace(this.unmaskRegex, '');
            const maskedNumber = this.unmaskedNumber.replace(this.formatterRegex, this.parseHelper);
            this._memoizedInputValue = maskedNumber;
            this._renderer.setProperty(this._elementRef.nativeElement, 'value', maskedNumber);
        } else {
            this._memoizedInputValue = '';
            this._renderer.setProperty(this._elementRef.nativeElement, 'value', '');
        }
    }
}
