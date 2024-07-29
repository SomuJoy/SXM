import { Directive, forwardRef, OnInit, HostListener, ElementRef, Renderer2, Injector, Input, Inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, FormControl, NgControl, Validators, ValidationErrors } from '@angular/forms';
import { DOCUMENT } from '@angular/common';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[appMaskZipCode]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MaskZipCodeDirective),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => MaskZipCodeDirective),
            multi: true
        }
    ]
})
export class MaskZipCodeDirective implements OnInit, ControlValueAccessor, Validator {
    private _codeSeparator = '-';
    private _separatorIndex = 5;
    private _maskRegex = /[^0-9]+/;
    private _onTouchedCallback: () => void;
    private _onChangeCallback: (_: any) => void;
    private _maskedNumber: string;
    private _maxLength = 10;
    @Input() zipMaskIsCanada = false;

    constructor(private _injector: Injector, private _renderer: Renderer2, private _elementRef: ElementRef, @Inject(DOCUMENT) private readonly _document: Document) {}

    ngOnInit() {
        if (this.zipMaskIsCanada) {
            this._codeSeparator = ' ';
            this._separatorIndex = 3;
            this._maskRegex = /[^A-z0-9]+/;
            this._maxLength = 7;
        }
        this._renderer.setAttribute(this._elementRef.nativeElement, 'maxlength', this._maxLength.toString());
    }

    @HostListener('input', ['$event']) onKeyDown(e: KeyboardEvent) {
        if (!this._maskedNumber || this._maskedNumber !== this._elementRef.nativeElement.value) {
            this._processValue(this._elementRef.nativeElement.value.toString());
            this._onChangeCallback && this._onChangeCallback(this._maskedNumber);

            // handles autofill
            if (this._document && this._document.activeElement !== this._elementRef.nativeElement) {
                this._onTouchedCallback && this._onTouchedCallback();
            }
        }
    }

    @HostListener('blur', ['$event']) hostBlur($event: MouseEvent): void {
        this._onTouchedCallback && this._onTouchedCallback();
    }

    writeValue(value: string | number) {
        this._processValue(value);
        this._onChangeCallback && this._onChangeCallback(this._maskedNumber);
        value && this._onTouchedCallback && this._onTouchedCallback();
    }

    registerOnChange(fn: any) {
        this._onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        this._onTouchedCallback = fn;
    }

    //validation is handled by the formcontrol
    validate(c: FormControl): ValidationErrors | null {
        return null;
    }

    private _processValue(value: string | number) {
        if (value) {
            this._maskedNumber = this._maskProcess(value);
            this._renderer.setProperty(this._elementRef.nativeElement, 'value', this._maskedNumber);
        } else {
            this._maskedNumber = '';
            this._renderer.setProperty(this._elementRef.nativeElement, 'value', '');
        }
    }

    private _maskProcess(value: string | number): string {
        let normalizedValue = value
            .toString()
            .replace(this._maskRegex, '')
            .slice(0, this._maxLength);
        const normalizedValueLenght = normalizedValue.length;
        if (normalizedValueLenght === this._separatorIndex && value.toString().length > this._separatorIndex) {
            normalizedValue += this._codeSeparator;
        } else if (normalizedValueLenght > this._separatorIndex) {
            normalizedValue = `${normalizedValue.slice(0, this._separatorIndex)}${this._codeSeparator}${normalizedValue.slice(this._separatorIndex)}`;
        }
        return this.zipMaskIsCanada ? normalizedValue.toUpperCase() : normalizedValue;
    }
}
