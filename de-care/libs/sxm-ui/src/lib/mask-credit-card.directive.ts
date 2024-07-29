import { Directive, forwardRef, OnInit, HostListener, ElementRef, Renderer2, Injector, Inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CreditCardHelper } from './credit-card-helper.class';
import { BinRangesToken, CardBinRanges } from '@de-care/shared/validation';

@Directive({
    selector: 'input[type="text"][sxmCreditCardType]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MaskCreditCardDirective),
            multi: true,
        },
    ],
})
export class MaskCreditCardDirective implements OnInit, ControlValueAccessor {
    private onTouchedCallback: () => void;
    private onChangeCallback: (_: any) => void;
    private unmaskRegex = /[^0-9]/g;

    unmaskedNumber: string;
    key: string;
    constructor(
        private _injector: Injector,
        private _renderer: Renderer2,
        private _elementRef: ElementRef,
        @Inject(BinRangesToken) private readonly _cardBinRanges: CardBinRanges
    ) {}

    private setMaskedCardNumber(unmaskedNumber: string) {
        const maskedNumber = CreditCardHelper.formatCardNumber(unmaskedNumber, this._cardBinRanges.binRanges);
        let start = this._elementRef.nativeElement.selectionStart;
        const currentPositionValue = maskedNumber.substring(start - 1, start);
        if (this.key !== 'Backspace' && this.key !== 'Delete' && currentPositionValue === ' ') {
            start = start + 1;
        }
        this._renderer.setProperty(this._elementRef.nativeElement, 'value', maskedNumber);
        this._elementRef.nativeElement.setSelectionRange(start, start);
    }

    ngOnInit() {}

    @HostListener('input', ['$event']) onKeyDown(e: KeyboardEvent) {
        this.writeValue(this._elementRef.nativeElement.value);
        this.onChangeCallback(this.unmaskedNumber);
    }

    @HostListener('keydown', ['$event']) onkeyup(event: KeyboardEvent) {
        this.key = event.key;
    }

    @HostListener('blur', ['$event']) hostBlur($event: MouseEvent): void {
        this.onTouchedCallback && this.onTouchedCallback();
    }

    writeValue(value: string) {
        if (value || value === '') {
            this.unmaskedNumber = value.replace(this.unmaskRegex, '');
            this.setMaskedCardNumber(this.unmaskedNumber);
        } else {
            this._renderer.setProperty(this._elementRef.nativeElement, 'value', '');
        }
    }

    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
}
