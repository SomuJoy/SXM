import { Component, HostBinding, Injector, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import * as uuid from 'uuid/v4';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'sxm-ui-charge-agreement-checkbox-form-field',
    template: `
        <ng-container *ngIf="translations$ | async as translations">
            <input
                [formControl]="control"
                type="checkbox"
                id="{{ controlId }}"
                name="{{ formControlName }}"
                data-e2e="chargeAgreementFormField"
                data-test="chargeAgreementFormField"
                class="checkbox"
            />
            <label for="{{ controlId }}" class="input-label small-copy">
                <span *ngIf="translations.LABEL_PART_A" class="legal-copy" [innerHTML]="translations.LABEL_PART_A"></span>
                <span *ngIf="translations.LABEL_PART_B" class="legal-copy" [innerHTML]="translations.LABEL_PART_B"></span>
                <span *ngIf="translations.LABEL_PART_C" class="legal-copy" [innerHTML]="translations.LABEL_PART_C"></span>
                <button
                    *ngIf="translations.LANGUAGE_LINK_TEXT"
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
    styleUrls: ['./charge-agreement-checkbox-form-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SxmUiChargeAgreementCheckboxFormFieldComponent,
            multi: true,
        },
    ],
})
export class SxmUiChargeAgreementCheckboxFormFieldComponent extends ControlValueAccessorConnector {
    @Input() set formButtonTextCopy(value: string) {
        this._formButtonCopyText$.next(value);
    }
    @Input() useRateVersionOfTextCopy = false;
    @HostBinding('class.checkbox-item') checkboxItemClass = true;
    controlId = uuid();
    private _translateKey = 'SharedSxmUiUiCreditCardFormFieldsModule.SxmUiChargeAgreementCheckboxFormFieldComponent';
    private _spanishTranslations =
        this._translateService.store.translations['es-US']['SharedSxmUiUiCreditCardFormFieldsModule']['SxmUiChargeAgreementCheckboxFormFieldComponent'];
    private _formButtonCopyText$ = new BehaviorSubject<string>('');
    private _inSpanish$ = new BehaviorSubject<boolean>(false);
    translations$: Observable<{
        LABEL_PART_A: string;
        LABEL_PART_B?: string;
        LABEL_PART_B_RATE_VERSION?: string;
        LABEL_PART_C_RATE_VERSION?: string;
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
                LABEL_PART_B: this.useRateVersionOfTextCopy
                    ? translations.LABEL_PART_B_RATE_VERSION.replace('{{formButtonTextCopy}}', formButtonCopyText)
                    : translations.LABEL_PART_B?.replace('{{formButtonTextCopy}}', formButtonCopyText),
                ...(!isUS ? { LANGUAGE_LINK_TEXT: '' } : {}),
                LABEL_PART_C: this.useRateVersionOfTextCopy ? translations.LABEL_PART_C_RATE_VERSION : '',
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
