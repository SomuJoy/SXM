import { Directive, Input } from '@angular/core';
import * as uuid from 'uuid/v4';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';

// TODO: move this to a common sxm-ui lib so other components can use it
@Directive()
export class BaseFormField extends ControlValueAccessorConnector {
    @Input() placeholderText: string;
    @Input() errorMessage: string;
    controlId = uuid();
    inputIsFocused = false;
}
