import { Directive, Injector, Input, ViewChild } from '@angular/core';
import { ControlContainer, ControlValueAccessor, FormControl, FormControlDirective, FormGroup, FormGroupDirective, NgControl } from '@angular/forms';

abstract class AbstractControlValueAccessorConnector implements ControlValueAccessor {
    protected abstract ngControl: NgControl;

    protected constructor(private readonly injector: Injector) {}

    get controlContainer() {
        return this.injector.get(ControlContainer);
    }

    registerOnTouched(fn: any): void {
        !!this.ngControl && this.ngControl.valueAccessor.registerOnTouched(fn);
    }

    registerOnChange(fn: any): void {
        !!this.ngControl && this.ngControl.valueAccessor.registerOnChange(fn);
    }

    writeValue(obj: any): void {
        !!this.ngControl && this.ngControl.valueAccessor.writeValue(obj);
    }

    setDisabledState(isDisabled: boolean): void {
        !!this.ngControl && this.ngControl.valueAccessor.setDisabledState(isDisabled);
    }
}

@Directive()
export class ControlValueAccessorConnector extends AbstractControlValueAccessorConnector {
    @Input() formControl: FormControl;
    @Input() formControlName: string;
    @ViewChild(FormControlDirective, { static: true }) ngControl;

    get control() {
        return this.formControl || this.controlContainer.control.get(this.formControlName);
    }

    constructor(injector: Injector) {
        super(injector);
    }
}

@Directive()
export class FormGroupControlValueAccessorConnector extends AbstractControlValueAccessorConnector {
    @Input() formGroup: FormGroup;
    @Input() formGroupName: string;
    @ViewChild(FormGroupDirective, { static: true }) ngControl;

    get control() {
        return this.formGroup || this.controlContainer.control.get(this.formGroupName);
    }

    constructor(injector: Injector) {
        super(injector);
    }
}
