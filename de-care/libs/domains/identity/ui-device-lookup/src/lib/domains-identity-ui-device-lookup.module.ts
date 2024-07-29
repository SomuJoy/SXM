import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiHelpFindingRadioModule } from '@de-care/shared/sxm-ui/ui-help-finding-radio';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { SharedSxmUiUiPrivacyPolicyModule } from '@de-care/shared/sxm-ui/ui-privacy-policy';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiUiRadioOptionFormFieldModule } from '@de-care/shared/sxm-ui/ui-radio-option-form-field';
import { SharedSxmUiUiTextFormFieldModule } from '@de-care/shared/sxm-ui/ui-text-form-field';
import { SharedSxmUiUiTextInputWithTooltipFormFieldModule } from '@de-care/shared/sxm-ui/ui-text-input-with-tooltip-form-field';
import { SharedSxmUiUiUsStateDropdownFormFieldModule } from '@de-care/shared/sxm-ui/ui-us-state-dropdown-form-field';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { SharedValidationFormControlInvalidModule } from '@de-care/shared/validation';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DeviceLookupIdOptionsFormComponent } from './device-lookup-id-options-form/device-lookup-id-options-form.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        SharedSxmUiUiRadioOptionFormFieldModule,
        SharedSxmUiUiTextFormFieldModule,
        SharedSxmUiUiTextInputWithTooltipFormFieldModule,
        SharedSxmUiUiUsStateDropdownFormFieldModule,
        SharedSxmUiUiHelpFindingRadioModule,
        SharedSxmUiUiModalModule,
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiUiPrivacyPolicyModule,
        SharedValidationFormControlInvalidModule
    ],
    declarations: [DeviceLookupIdOptionsFormComponent],
    exports: [DeviceLookupIdOptionsFormComponent]
})
export class DomainsIdentityUiDeviceLookupModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') }
        };

        super(translateService, languages);
    }
}
