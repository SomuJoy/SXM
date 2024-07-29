import { Component, HostBinding, Injector, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import * as uuid from 'uuid/v4';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'sxm-ui-invoice-agreement-checkbox-form-field',
    template: `
        <ng-container *ngIf="translations$ | async as translations">
            <input [formControl]="control" type="checkbox" id="{{ controlId }}" name="{{ formControlName }}" data-e2e="invoiceAgreementFormField" class="checkbox" />
            <label for="{{ controlId }}" class="input-label small-copy">
                <p class="legal-copy" [innerHTML]="translations.LABEL_PART_A"></p>
                <button
                    type="button"
                    role="switch"
                    [attr.lang]="translations.LANGUAGE_LINK_VALUE"
                    sxmUiDataClickTrack="ui"
                    (click)="toggleLanguage(translations.LANGUAGE_LINK_VALUE)"
                >
                    {{ translations.LANGUAGE_LINK_TEXT }}
                </button>
            </label>
            <div *ngIf="control.invalid && control.touched" class="invalid-feedback">
                <p>{{ translations.ERROR_REQUIRED }}</p>
            </div>
        </ng-container>
    `,
    styleUrls: ['./invoice-agreement-checkbox-form-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SxmUiInvoiceAgreementCheckboxFormFieldComponent,
            multi: true,
        },
    ],
})
export class SxmUiInvoiceAgreementCheckboxFormFieldComponent extends ControlValueAccessorConnector {
    @Input() set formButtonTextCopy(value: string) {
        this._formButtonCopyText$.next(value);
    }
    @HostBinding('class.checkbox-item') checkboxItemClass = true;
    controlId = uuid();
    private _translateKey = 'SharedSxmUiUiCreditCardFormFieldsModule.SxmUiInvoiceAgreementCheckboxFormFieldComponent';
    private _spanishTranslations =
        this._translateService.store.translations['es-US']['SharedSxmUiUiCreditCardFormFieldsModule']['SxmUiInvoiceAgreementCheckboxFormFieldComponent'];
    private _formButtonCopyText$ = new BehaviorSubject<string>('');
    private _inSpanish$ = new BehaviorSubject<boolean>(false);
    translations$: Observable<{
        LABEL_PART_A: string;
        LANGUAGE_LINK_TEXT: string;
        LANGUAGE_LINK_VALUE: string;
        ERROR_REQUIRED: string;
    }> = combineLatest([this._formButtonCopyText$, this._translateService.stream(this._translateKey), this._inSpanish$]).pipe(
        map(([formButtonCopyText, translations, inSpanish]) => {
            const isUS = this._translateService.currentLang.toLowerCase() === 'en-us';
            if (isUS && inSpanish) {
                return {
                    ...this._spanishTranslations,
                    LABEL_PART_A: this._spanishTranslations.LABEL_PART_A.replace('{{formButtonTextCopy}}', formButtonCopyText),
                };
            }
            return {
                ...translations,
                LABEL_PART_A: translations.LABEL_PART_A.replace('{{formButtonTextCopy}}', formButtonCopyText),
                ...(!isUS ? { LANGUAGE_LINK_TEXT: '' } : {}),
            };
        })
    );

    constructor(injector: Injector, private readonly _translateService: TranslateService) {
        super(injector);
    }

    toggleLanguage(langCode: string) {
        this._inSpanish$.next(langCode.toLowerCase() === 'es-us');
    }
}
