import { Component, Injector, Input, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
@Component({
    selector: 'sxm-ui-numeric-form-field',
    templateUrl: './numeric-form-field.component.html',
    styleUrls: ['./numeric-form-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SxmUiNumericFormFieldComponent,
            multi: true
        }
    ]
})
export class SxmUiNumericFormFieldComponent extends ControlValueAccessorConnector implements OnInit {
    @Input() qatagName = '';
    @Input() labelText = '';
    @Input() controlId = '';
    @Input() errorMsg;
    @Input() minNumber: number;
    @Input() maxNumber: number;
    @Input() maxDigits = Infinity;
    @ViewChild('InputElement') inputElement: ElementRef;

    readonly regex = /^[0-9]$/;
    readonly specialKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Backspace', 'Delete', 'Enter', 'Tab'];

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {}

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if ((event.key.match(this.regex) && this.inputElement.nativeElement.value.length < this.maxDigits) || this.specialKeys.indexOf(event.key) !== -1) {
            return event;
        }
        event.preventDefault();
        event.stopPropagation();
    }
}
