import { Directive, ElementRef, HostListener, Injector, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
    selector: '[sxmUiMaskExpirationDate]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SxmUiMaskExpirationDateDirective,
            multi: true,
        },
    ],
})
export class SxmUiMaskExpirationDateDirective implements ControlValueAccessor {
    private formatterRegex = /([\d]{1,2})\/*([\d]{1,3})?/;
    private separator = '/';
    private unmaskRegex = /[^0-9\/]/g;
    private zeroSlashRegex = /^([\/])|^([0])([0\/])/; //checks for start of string '/', '0/', '00'
    private notMonthRegex = /^([2-9][0-9]|1[3-9])/; //checks that first 2 chars do not make valid month (ie 53, 15)
    private extraSlashRegex = /([\/]\d*)([\/])/; //checks for an instance of a slash followed by digits followed by another slash
    private isBackSpaceOrDelete = false;
    private onTouchedCallback: () => void;
    private onChangeCallback: (_: any) => void;

    constructor(private _injector: Injector, private _renderer: Renderer2, private _elementRef: ElementRef) {}

    @HostListener('input', ['$event']) onInput(e: KeyboardEvent) {
        this.writeValue(this._elementRef.nativeElement.value);
        this.onChangeCallback(this._elementRef.nativeElement.value);
    }

    // listens for arrow keys then runs regex, listens and marks if backspace or delete
    @HostListener('keydown', ['$event']) onKeyDown(e: KeyboardEvent) {
        switch (e.key) {
            case 'ArrowTop':
            case 'ArrowRight':
            case 'ArrowBottom':
            case 'ArrowLeft':
                // this is so if the user goes back and changes a value in the month making it invalid,
                // as soon as they use the arrow keys to move to another part, it runs the formatter and fixes it
                this.isBackSpaceOrDelete = false;
                this.writeValue(this._elementRef.nativeElement.value);
                this.onChangeCallback(this._elementRef.nativeElement.value);
                break;
            case 'Backspace':
            case 'Delete':
                this.isBackSpaceOrDelete = true;
                break;
            default:
                this.isBackSpaceOrDelete = false;
        }
    }

    @HostListener('blur', ['$event']) hostBlur($event: MouseEvent): void {
        this.writeValue(this._elementRef.nativeElement.value);
        this.onTouchedCallback && this.onTouchedCallback();
    }

    writeValue(value: string) {
        if (value) {
            const unmaskedNumber = value.replace(this.unmaskRegex, '');
            const zeroSlashGate = unmaskedNumber.replace(this.zeroSlashRegex, '01');
            const invalidMonthGate = zeroSlashGate.replace(this.notMonthRegex, this.parseNotMonthHelper.bind(this));
            // if the key is a backspace or delete then don't use the zeroSlash and invalidMonth gates
            const maskedNumber = this.isBackSpaceOrDelete
                ? unmaskedNumber.replace(this.formatterRegex, this.parseHelper.bind(this))
                : invalidMonthGate.replace(this.formatterRegex, this.parseHelper.bind(this));

            // removes a second slash that might appear because the user changed the month to an invalid month causing the parseHelper to insert an extra slash
            const extraSlashGate = maskedNumber.replace(this.extraSlashRegex, this.parseExtraSlashHelper);
            this._renderer.setProperty(this._elementRef.nativeElement, 'value', extraSlashGate);
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

    // removed the second slash after the first
    private parseExtraSlashHelper(match: string, p1: string, p2: string): string {
        return p1;
    }

    // if the first 2 digits do not make a valid month this will separate the digits with a '/'
    private parseNotMonthHelper(match: string, p1: string, p2: string): string {
        return match.charAt(0) + this.separator + match.charAt(1);
    }

    // properly separates the input into a MM/YY format
    private parseHelper(match: string, p1: string, p2: string): string {
        let result = '';
        if (this.isBackSpaceOrDelete) {
            result = match;
        } else {
            if (p1) {
                if (p1.length < 2) {
                    result += p1;
                } else if (p1.length === 2) {
                    // if year digit(s) exists then let the next logic block add the separator, otherwise add it here
                    result += p2 ? p1 : p1 + this.separator;
                }
            }

            if (p2) {
                if (p2.length < 2) {
                    result += this.separator + p2;
                } else {
                    if (p1.length < 2) {
                        // if the month is only 1 digit and the year is 2 digits, then add a 0 to beginning of the month
                        // use only the first 2 chars, becuase there is a scenario where the year can get 3 digits unintentionally
                        result = `0${result}${this.separator}${p2.substring(0, 2)}`;
                    } else {
                        result += this.separator + p2.substring(0, 2);
                    }
                }
            }
        }

        return result;
    }
}
