import { ElementRef, HostListener, NgModule, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
    selector: 'sxm-ui-date-of-birth-form-field',
    templateUrl: './date-of-birth-form-field.component.html',
    styleUrls: ['./date-of-birth-form-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: DateOfBirthFormFieldComponent,
            multi: true,
        },
    ],
})
export class DateOfBirthFormFieldComponent extends ControlValueAccessorConnector implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    controlId = uuid();
    @Input() errorMsg: string;
    @Input() labelText: string;
    @ViewChild('InputElement') inputElement: ElementRef;
    inputIsFocused = false;

    readonly regex = /^[0-9/]$/;
    readonly specialKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Backspace', 'Delete', 'Enter', 'Tab'];

    constructor(readonly translationsForComponentService: TranslationsForComponentService, injector: Injector) {
        super(injector);
        translationsForComponentService.init(this);
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if ((event.key.match(this.regex) && this.inputElement.nativeElement.value.length < 5) || this.specialKeys.indexOf(event.key) !== -1) {
            return event;
        }
        event.preventDefault();
        event.stopPropagation();
    }
}

@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), FormsModule, ReactiveFormsModule],
    declarations: [DateOfBirthFormFieldComponent],
    exports: [DateOfBirthFormFieldComponent],
})
export class SharedSxmUiUiDateOfBirthFormFieldModule {}
