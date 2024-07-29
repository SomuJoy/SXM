import { Component, HostBinding, Injector } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SxmUiDropdownComponent } from '@de-care/shared/sxm-ui/ui-dropdown-form-field';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'sxm-ui-us-state-dropdown-form-field',
    templateUrl: './us-state-dropdown-form-field.component.html',
    styleUrls: ['./us-state-dropdown-form-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: USStateDropdownFormFieldComponent,
            multi: true
        }
    ]
})
export class USStateDropdownFormFieldComponent extends SxmUiDropdownComponent {
    translateKeyPrefix = 'SharedSxmUiUiUsStateDropdownFormFieldModule.USStateDropdownFormFieldComponent.';
    @HostBinding('attr.name') name = 'region';
    @HostBinding('attr.autocomplete') autocomplete = 'region';
    @HostBinding('class.dropdown') dropdownClass = true;

    constructor(translateService: TranslateService, injector: Injector) {
        super(injector);
        const { STATES, PLACEHOLDER_TEXT, ERROR_MESSAGE } = translateService.instant('SharedSxmUiUiUsStateDropdownFormFieldModule.USStateDropdownFormFieldComponent');
        this.passedValue = STATES;
        this.key = 'key';
        this.text = 'key';
        this.labelText = PLACEHOLDER_TEXT;
        this.errorMsg = ERROR_MESSAGE;
    }
}
