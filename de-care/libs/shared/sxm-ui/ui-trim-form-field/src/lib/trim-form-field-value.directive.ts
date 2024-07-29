import { Directive, HostListener, ElementRef, Renderer2, Inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DOCUMENT } from '@angular/common';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[appTrimFormField]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: TrimFormFieldDirective,
            multi: true,
        },
    ],
})
export class TrimFormFieldDirective implements ControlValueAccessor {
    private onTouchedCallback: () => void;
    private onChangeCallback: (_: any) => void;

    constructor(private readonly _elementRef: ElementRef, private readonly _renderer: Renderer2, @Inject(DOCUMENT) private readonly _document: Document) {}

    @HostListener('blur', ['$event']) onBlur(e: Event) {
        this.writeValue(this._elementRef.nativeElement.value);
        this.onTouchedCallback && this.onTouchedCallback();
    }
    // handle autofill
    @HostListener('input', ['$event']) input(e: Event) {
        if (this._document && this._document.activeElement !== this._elementRef.nativeElement) {
            this.writeValue(this._elementRef.nativeElement.value);
            this.onTouchedCallback && this.onTouchedCallback();
        }
    }

    writeValue(value: string) {
        if (this._elementRef.nativeElement?.type === 'email') {
            // TODO: Check for a cleaner solution. input type emails behaves different to input type text, keeping the white spaces.
            this._renderer.setProperty(this._elementRef.nativeElement, 'value', '');
        }
        let newValue;
        if (this._elementRef.nativeElement?.getAttribute('data-field-type') === 'radioId') {
            newValue = value ? value.split('-').join('').trim() : value;
        } else {
            newValue = value ? value.trim() : value;
        }
        this.onChangeCallback && this.onChangeCallback(newValue);
        this._renderer.setProperty(this._elementRef.nativeElement, 'value', newValue || '');
    }

    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    }
}
