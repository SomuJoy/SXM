import { Component, ElementRef, EventEmitter, forwardRef, HostBinding, HostListener, Injector, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import * as uuid from 'uuid/v4';

interface DropdownComponentValue {
    value: string | number;
    label: string | number;
    selected: boolean;
    focused: boolean;
    index: number;
}

type DropdownComponentNavDirection = 'next' | 'back';

@Component({
    selector: 'sxm-ui-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SxmUiDropdownComponent),
            multi: true,
        },
    ],
})
export class SxmUiDropdownComponent extends ControlValueAccessorConnector implements OnInit, OnChanges {
    private onTouchedCallback: () => void;
    private onChangeCallback: (_: any) => void;
    private _memoizedInputValue: any = null;
    @Input() passedValue: any[] = [];
    @Input() labelText: string;
    @Input() errorMsg: string;
    @Input() text: string;
    @Input() key: string;
    @Input() filterSelected: boolean = false;
    @Input() uniqueId: string;
    @Input() qatag: string;
    @Input() autocomplete: string = 'on';
    @Input() name: string;
    @Input() showErrorMsg = false;
    @Output() listChanged = new EventEmitter();

    @ViewChild('inputField', { static: true }) inputField: ElementRef;

    dropDownvalues: DropdownComponentValue[] = [];
    storedUniqueId = uuid();
    currentLabel: string | number;
    selectedValue: DropdownComponentValue;
    foundValue: DropdownComponentValue = null;
    focusedValue: DropdownComponentValue = null;
    closeOnOptionBlur = true;
    mouseOverList = false;

    @HostBinding('attr.id') id = uuid();

    @HostBinding('class.active') isActive = false;

    @HostListener('keydown', ['$event']) hostKeydownEnter($event: KeyboardEvent): void {
        /*
          TODO:
          We are disabling the lint check for deprecation of `keyCode` because there is no viable alternative at this time
          https://caniuse.com/#search=keyboardevent
        */

        // enter
        // tslint:disable-next-line deprecation
        if ($event.keyCode === 13) {
            this.handleHostEnter($event);
        }

        // tab
        // tslint:disable-next-line deprecation
        else if ($event.keyCode === 9) {
            this.handleHostTab($event);
        }

        // escape
        // tslint:disable-next-line deprecation
        else if ($event.keyCode === 27) {
            this.isActive = false;
        }

        // up arrow
        // tslint:disable-next-line deprecation
        else if ($event.keyCode === 38) {
            this.handleHostUpKey($event);
        }

        // down arrow
        // tslint:disable-next-line deprecation
        else if ($event.keyCode === 40) {
            this.handleHostDownKey($event);
        }
        // handle letters
        else {
            this.handleHostKeyLetters($event);
        }
    }

    @HostListener('click', ['$event']) hostClick($event: MouseEvent): void {
        if (this.isActive) {
            this.isActive = false;
        } else {
            this.openDropDown();
        }
    }

    @HostListener('blur', ['$event']) hostBlur($event: MouseEvent): void {
        if (!this.isActive) {
            this.onTouchedCallback && this.onTouchedCallback();
        }
    }

    /*
     * handles browser autofill
     */
    @HostListener('input', ['$event']) test($event: MouseEvent): void {
        if (!this._memoizedInputValue || this._memoizedInputValue !== this.inputField.nativeElement.value) {
            this._memoizedInputValue = this.inputField.nativeElement.value;
            this._processInComingValue(this._memoizedInputValue);
            this.onChangeCallback && this.onChangeCallback(this.selectedValue && this.selectedValue.value);
            this.onTouchedCallback && this.onTouchedCallback();
        }
    }

    get _uniqueId() {
        return this.uniqueId || this.storedUniqueId;
    }

    constructor(injector: Injector) {
        super(injector);
    }

    private findDvByValue(value: string): DropdownComponentValue {
        return this.dropDownvalues.find((dv) => {
            return dv.value.toString().toLowerCase() === value.toString().toLowerCase();
        });
    }

    private parsePassedValues(payloadValues: any[]): void {
        this.dropDownvalues = payloadValues.map((val, index) => {
            let value;
            let label;
            if (typeof val === 'string' || typeof val === 'number') {
                value = val;
                label = val;
            } else {
                value = val[this.key];
                label = this.text ? val[this.text] : value;
            }
            return {
                value,
                label,
                selected: false,
                focused: false,
                index,
            };
        });
        this.listChanged.emit();
    }

    private navigateOptions(type: DropdownComponentNavDirection): DropdownComponentValue {
        let nextValue: DropdownComponentValue = null;
        if (this.focusedValue) {
            const newIndex = this.focusedValue.index + (type === 'next' ? 1 : -1);
            if (newIndex >= 0 && newIndex < this.dropDownvalues.length) {
                nextValue = this.dropDownvalues[newIndex];
            } else {
                nextValue = this.dropDownvalues[type === 'next' ? this.dropDownvalues.length - 1 : 0];
            }
        } else {
            nextValue = this.dropDownvalues[type === 'next' ? 0 : this.dropDownvalues.length - 1];
        }
        return nextValue;
    }

    private findValueByChar(start: number, charStr: string): DropdownComponentValue {
        let newFoundValue: DropdownComponentValue;
        // using for for better performance and iteration manipulation
        // using internal let increases performance
        for (let i = start, max = this.dropDownvalues.length; i < max; i++) {
            const currentValue = this.dropDownvalues[i];
            if (currentValue.value.toString().charAt(0) === charStr) {
                newFoundValue = currentValue;
                break;
            }
        }
        return newFoundValue;
    }

    ngOnChanges(payload): void {
        this.parsePassedValues(payload.passedValue ? payload.passedValue.currentValue : this.passedValue);
        if (this.selectedValue) {
            const newSelectedValue = this.dropDownvalues.find((dropDValue) => dropDValue.value === this.selectedValue.value);
            this.currentLabel = newSelectedValue ? newSelectedValue.label : null;
            this.selectedValue = newSelectedValue || null;
        }
        this.addOrRemoveNameToInput();
    }

    addOrRemoveNameToInput(): void {
        if (!!this.name) {
            this.inputField.nativeElement.name = this.name;
        }
    }

    ngOnInit(): void {}

    handleHostKeyLetters($event: KeyboardEvent): void {
        this.closeOnOptionBlur = false;
        if (!this.isActive) {
            this.isActive = true;
        }
        $event.preventDefault();
        const charCode = $event.keyCode; // tslint:disable-line deprecation
        const charStr = String.fromCharCode(charCode);
        let newFoundValue: DropdownComponentValue;

        if (this.foundValue && this.foundValue.value.toString().charAt(0) === charStr) {
            newFoundValue = this.findValueByChar(this.foundValue.index + 1, charStr);
        }

        // search for other values
        if (!newFoundValue) {
            newFoundValue = this.findValueByChar(0, charStr);
        }

        if (newFoundValue) {
            this.foundValue = newFoundValue;
            this.focusOption(newFoundValue);
        }
    }

    handleHostTab($event: KeyboardEvent): void {
        if (this.isActive) {
            const next = this.navigateOptions('next');
            if (next) {
                $event.preventDefault();
                this.focusOption(next);
                this.closeOnOptionBlur = false;
            } else {
                this.closeOnOptionBlur = true;
                this.isActive = false;
                this.focusedValue = null;
            }
        }
    }

    handleHostEnter($event: KeyboardEvent): void {
        $event.preventDefault();
        if (this.isActive) {
            if (!this.focusedValue) {
                this.focusedValue = this.dropDownvalues[0];
            }
            this.selectItem();
        } else {
            this.openDropDown();
        }
    }

    handleHostUpKey($event: KeyboardEvent): void {
        $event.preventDefault();
        this.closeOnOptionBlur = false;
        const selected = this.navigateOptions('back');
        this.focusOption(selected);
    }

    handleHostDownKey($event: KeyboardEvent): void {
        $event.preventDefault();
        this.closeOnOptionBlur = false;
        const selected = this.navigateOptions('next');
        this.focusOption(selected);
    }

    openDropDown(): void {
        this.isActive = true;
        const toFocus = this.selectedValue || this.dropDownvalues[0];
        this.focusOption(toFocus);
        this.foundValue = this.focusedValue;
        this.closeOnOptionBlur = true;
    }

    focusOption(dropDownValue: DropdownComponentValue): void {
        this.focusedValue = dropDownValue;
        dropDownValue.focused = true;
    }

    optionBlur(value: DropdownComponentValue): void {
        value.focused = false;

        if (this.closeOnOptionBlur && !this.mouseOverList) {
            this.isActive = false;
            this.onTouchedCallback && this.onTouchedCallback();
        } else {
            this.closeOnOptionBlur = true;
        }
    }

    listMouseOn() {
        this.mouseOverList = true;
    }

    listMouseLeave() {
        this.mouseOverList = false;
    }

    listBlur() {
        if (!this.mouseOverList) {
            this.isActive = false;
            this.onTouchedCallback && this.onTouchedCallback();
        }
    }

    optionMouseOn(dropDownValue: DropdownComponentValue): void {
        this.focusedValue = dropDownValue;
        dropDownValue.focused = true;
        this.closeOnOptionBlur = false;
    }

    optionLeave(): void {
        this.focusedValue = null;
        this.closeOnOptionBlur = true;
    }

    selectItem(): void {
        if (this.selectedValue) {
            this.selectedValue.selected = false;
        }
        this.focusedValue.selected = true;
        this.currentLabel = this.focusedValue.label;
        this.selectedValue = this.focusedValue;
        this.onChangeCallback && this.onChangeCallback(this.focusedValue.value);
        this.focusedValue = null;
        this.isActive = false;
    }

    writeValue(comingValue: any): void {
        this._processInComingValue(comingValue);
        this.onChangeCallback && this.onChangeCallback(this.selectedValue && this.selectedValue.value);
        comingValue && this.onTouchedCallback && this.onTouchedCallback();
    }

    registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouchedCallback = fn;
    }

    private _processInComingValue(comingValue: any) {
        const found = comingValue && this.findDvByValue(comingValue);
        if (found) {
            found.selected = true;
            this.currentLabel = found.label;
            this.selectedValue = found;
            this.isActive = false;
        } else {
            const selectedDropDownValues = this.dropDownvalues.filter((dv) => dv.selected);
            if (selectedDropDownValues) {
                selectedDropDownValues.forEach((dv) => {
                    dv.selected = false;
                });
            }
            this.currentLabel = null;
            this.selectedValue = null;
        }
    }
}
