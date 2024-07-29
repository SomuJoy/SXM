import { Directive, HostListener, ElementRef, Renderer2, Inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DOCUMENT } from '@angular/common';

@Directive({
    // eslint-disable-next-line
    selector: '[apRadioIdFormField]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: RadioidFormFieldValueDirective,
            multi: true
        }
    ]
})
export class RadioidFormFieldValueDirective implements ControlValueAccessor {
    private onTouchedCallback: () => void;
    private onChangeCallback: (_) => void;

    constructor(private readonly _elementRef: ElementRef, private readonly _renderer: Renderer2, @Inject(DOCUMENT) private readonly _document: Document) {}

    @HostListener('blur', ['$event']) onBlur() {
        this.writeValue(this._elementRef.nativeElement.value);
        this.onTouchedCallback && this.onTouchedCallback();
    }

    // handle autofill
    @HostListener('input', ['$event']) input() {
        if (this._document && this._document.activeElement !== this._elementRef.nativeElement) {
            this.writeValue(this._elementRef.nativeElement.value);
            this.onTouchedCallback && this.onTouchedCallback();
        }
    }

    writeValue(value: string) {
        const newValue = value
            ? value
                  .split('-')
                  .join('')
                  .trim()
            : value;
        this.onChangeCallback && this.onChangeCallback(newValue);
        this._renderer.setProperty(this._elementRef.nativeElement, 'value', newValue || '');
    }

    registerOnChange(fn) {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn) {
        this.onTouchedCallback = fn;
    }
}
