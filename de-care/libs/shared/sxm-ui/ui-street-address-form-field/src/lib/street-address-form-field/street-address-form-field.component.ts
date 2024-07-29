import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Component, Injector, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import * as uuid from 'uuid/v4';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-street-address-form-field',
    templateUrl: './street-address-form-field.component.html',
    styleUrls: ['./street-address-form-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: StreetAddressFormFieldComponent,
            multi: true,
        },
    ],
})
export class StreetAddressFormFieldComponent extends ControlValueAccessorConnector implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    controlId = uuid();
    @Input() errorMsg: string;
    @Input() labelText: string;
    inputIsFocused = false;

    constructor(readonly translationsForComponentService: TranslationsForComponentService, injector: Injector) {
        super(injector);
        translationsForComponentService.init(this);
    }
}

@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), FormsModule, ReactiveFormsModule],
    declarations: [StreetAddressFormFieldComponent],
    exports: [StreetAddressFormFieldComponent],
})
export class SharedSxmUiUiStreetAddressFormFieldModule {}