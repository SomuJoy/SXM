import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PackageDescriptionTranslationsService } from '@de-care/app-common';
import { DomainsChatUiChatWithAgentLinkModule } from '@de-care/domains/chat/ui-chat-with-agent-link';
import { PrintService } from '@de-care/shared/browser-common/window-print';
import { SharedSxmUiUiAccordionChevronModule } from '@de-care/shared/sxm-ui/ui-accordion-chevron';
import { SharedSxmUiUiAccordionStepperModule } from '@de-care/shared/sxm-ui/ui-accordion-stepper';
import { SharedSxmUiUiContentCardModule } from '@de-care/shared/sxm-ui/ui-content-card';
import { SharedSxmUiUiDropdownFormFieldModule } from '@de-care/shared/sxm-ui/ui-dropdown-form-field';
import { SharedSxmUiUiEnableShowPasswordModule } from '@de-care/shared/sxm-ui/ui-enable-show-password';
import { SharedSxmUiUiFlepzFormFieldsModule } from '@de-care/shared/sxm-ui/ui-flepz-form-fields';
import { SharedSxmUiUiFormFieldMasksModule } from '@de-care/shared/sxm-ui/ui-form-field-masks';
import { SharedSxmUiUiInputFocusModule } from '@de-care/shared/sxm-ui/ui-input-focus';
import { SharedSxmUiUiListenNowModule } from '@de-care/shared/sxm-ui/ui-listen-now';
import { SharedSxmUiUiLoadingIndicatorModule } from '@de-care/shared/sxm-ui/ui-loading-indicator';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { SharedSxmUiUiPasswordFormFieldModule } from '@de-care/shared/sxm-ui/ui-password-form-field';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiUiSafeHtmlModule } from '@de-care/shared/sxm-ui/ui-safe-html';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { SharedSxmUiUiTooltipModule } from '@de-care/shared/sxm-ui/ui-tooltip';
import { SharedSxmUiUiTrimFormFieldModule } from '@de-care/shared/sxm-ui/ui-trim-form-field';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { SharedValidationFormControlInvalidModule } from '@de-care/shared/validation';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { SxmUiBannerComponent } from './banner/banner.component';
import { SxmUiCardWithCtaComponent } from './card-with-cta/card-with-cta.component';
import { CreditCardNumberInputComponent } from './credit-card-number-input/credit-card-number-input.component';
import { CreditCardTypeDirective } from './credit-card-type.directive';
import { IsTrialPlan } from './is-trial-plan.pipe';
import { MaskCreditCardDirective } from './mask-credit-card.directive';
import { MaskExpirationDateDirective } from './mask-expiration-date.directive';
import { PhoneNumberPipe } from './phone-number.pipe';
import { PlatformFromPackageNamePipe } from './platform-from-package-name.pipe';
import { SxmUiShowHideComponent } from './show-hide/show-hide.component';
import { TooltipIconDirective } from './tool-tip-icon.directive';
import { WithoutPlatformNameStreamingPipe } from './without-platform-name-streaming.pipe';
import { WithoutPlatformNameWithArticlePipe } from './without-platform-name-with-article.pipe';
import { WithoutPlatformNamePipe } from './without-platform-name.pipe';

const DECLARATIONS = [
    SxmUiBannerComponent,
    CreditCardTypeDirective,
    PhoneNumberPipe,
    WithoutPlatformNamePipe,
    WithoutPlatformNameWithArticlePipe,
    WithoutPlatformNameStreamingPipe,
    PlatformFromPackageNamePipe,
    MaskExpirationDateDirective,
    MaskCreditCardDirective,
    SxmUiCardWithCtaComponent,
    CreditCardNumberInputComponent,
    SxmUiShowHideComponent,
    AppFooterComponent,
    IsTrialPlan,
    TooltipIconDirective,
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiUiInputFocusModule,
        SharedSxmUiUiModalModule,
        SharedSxmUiUiDropdownFormFieldModule,
        SharedSxmUiUiFlepzFormFieldsModule,
        SharedValidationFormControlInvalidModule,
        SharedSxmUiUiFormFieldMasksModule,
        SharedSxmUiUiTrimFormFieldModule,
        SharedSxmUiUiStepperModule,
        SharedSxmUiUiEnableShowPasswordModule,
        SharedSxmUiUiPasswordFormFieldModule,
        SharedSxmUiUiAccordionChevronModule,
        SharedSxmUiUiTooltipModule,
        DomainsChatUiChatWithAgentLinkModule,
        SharedSxmUiUiListenNowModule,
        SharedSxmUiUiContentCardModule,
        SharedSxmUiUiSafeHtmlModule,
        SharedSxmUiUiAccordionStepperModule,
        SharedSxmUiUiLoadingIndicatorModule,
    ],
    providers: [PrintService],
    declarations: [...DECLARATIONS],
    exports: [
        ...DECLARATIONS,
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiUiInputFocusModule,
        SharedSxmUiUiModalModule,
        SharedSxmUiUiDropdownFormFieldModule,
        SharedSxmUiUiFlepzFormFieldsModule,
        SharedValidationFormControlInvalidModule,
        SharedSxmUiUiFormFieldMasksModule,
        SharedSxmUiUiTrimFormFieldModule,
        SharedSxmUiUiStepperModule,
        SharedSxmUiUiEnableShowPasswordModule,
        SharedSxmUiUiPasswordFormFieldModule,
        SharedSxmUiUiAccordionChevronModule,
        SharedSxmUiUiTooltipModule,
        SharedSxmUiUiListenNowModule,
        SharedSxmUiUiContentCardModule,
        SharedSxmUiUiSafeHtmlModule,
        SharedSxmUiUiAccordionStepperModule,
        SharedSxmUiUiLoadingIndicatorModule,
    ],
})
export class SxmUiModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService, packageDescriptionTranslationsService: PackageDescriptionTranslationsService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/sxm-ui.en-CA.json'),
            'en-US': require('./i18n/sxm-ui.en-US.json'),
            'fr-CA': require('./i18n/sxm-ui.fr-CA.json'),
        };
        super(translateService, languages);
        packageDescriptionTranslationsService.loadTranslations(translateService);
    }
}
