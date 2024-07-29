import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { UnauthenticatedLandingPageComponent } from './pages/unauthenticated-landing-page/unauthenticated-landing-page.component';
import { DeCareUseCasesSharedUiShellBasicModule, ShellBasicWithLangToggleComponent } from '@de-care/de-care-use-cases/shared/ui-shell-basic';
import { TempIncludeGlobalStyleScriptCanActivateService, UpdateUsecaseCanActivateService } from '@de-care/de-care-use-cases/shared/ui-router-common';
import { TranslateModule } from '@ngx-translate/core';
import { LoadPageGuard } from './route-guards/load-page-guard';
import { DeCareUseCasesSharedUiPageMainModule } from '@de-care/de-care-use-cases/shared/ui-page-main';
import { SharedSxmUiUiTabsModule } from '@de-care/shared/sxm-ui/ui-tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedValidationFormControlInvalidModule } from '@de-care/shared/validation';
import { SharedSxmUiUiTextFormFieldModule } from '@de-care/shared/sxm-ui/ui-text-form-field';
import { SharedSxmUiUiPhoneNumberFormFieldModule } from '@de-care/shared/sxm-ui/ui-phone-number-form-field';
import { SharedSxmUiUiCheckboxWithLabelFormFieldModule } from '@de-care/shared/sxm-ui/ui-checkbox-with-label-form-field';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { SharedSxmUiUiHelpFindingRadioModule } from '@de-care/shared/sxm-ui/ui-help-finding-radio';
import { DeCareUseCasesSubscriptionStateRefreshRadioSignalModule } from '@de-care/de-care-use-cases/subscription/state-refresh-radio-signal';
import { AuthenticatedLandingPageComponent } from './pages/authenticated-landing-page/authenticated-landing-page.component';
import { CustomerLookupByCanActivateService } from './route-guards/customer-lookup-can-activate.service';
import { DeCareSharedUiPageShellBasicModule, PageProcessingMessageComponent } from '@de-care/de-care/shared/ui-page-shell-basic';
import { SharedSxmUiUiAlertPillModule } from '@de-care/shared/sxm-ui/ui-alert-pill';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { TextMessageSentConfirmationPageComponent } from './pages/text-message-sent-confirmation-page/text-message-sent-confirmation-page.component';
import { SharedSxmUiUiPrivacyPolicyModule } from '@de-care/shared/sxm-ui/ui-privacy-policy';
import { DomainsChatUiChatWithAgentLinkModule } from '@de-care/domains/chat/ui-chat-with-agent-link';

const routes: Route[] = [
    {
        path: '',
        component: ShellBasicWithLangToggleComponent,
        canActivate: [TempIncludeGlobalStyleScriptCanActivateService, LoadPageGuard],
        data: { shellBasicWithLangToggle: { darkMode: true } },
        children: [
            {
                path: '',
                pathMatch: 'full',
                canActivate: [CustomerLookupByCanActivateService],
                component: PageProcessingMessageComponent,
            },
            {
                path: 'unauthenticated-landing-page',
                pathMatch: 'full',
                component: UnauthenticatedLandingPageComponent,
                data: { useCaseKey: 'STAND_ALONE_DEVICE_REFRESH' },
                canActivate: [UpdateUsecaseCanActivateService, LoadPageGuard],
            },
            {
                path: 'authenticated-landing-page',
                pathMatch: 'full',
                component: AuthenticatedLandingPageComponent,
                data: { useCaseKey: 'STAND_ALONE_DEVICE_REFRESH' },
                canActivate: [UpdateUsecaseCanActivateService, LoadPageGuard],
            },
            {
                path: 'text-message-sent-confirmation',
                pathMatch: 'full',
                component: TextMessageSentConfirmationPageComponent,
                canActivate: [LoadPageGuard],
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        TranslateModule.forChild(),
        DeCareUseCasesSharedUiPageMainModule,
        SharedSxmUiUiTabsModule,
        FormsModule,
        ReactiveFormsModule,
        SharedValidationFormControlInvalidModule,
        SharedSxmUiUiTextFormFieldModule,
        SharedSxmUiUiPhoneNumberFormFieldModule,
        SharedSxmUiUiCheckboxWithLabelFormFieldModule,
        SharedSxmUiUiModalModule,
        SharedSxmUiUiHelpFindingRadioModule,
        DeCareUseCasesSubscriptionStateRefreshRadioSignalModule,
        SharedSxmUiUiAlertPillModule,
        SharedSxmUiUiProceedButtonModule,
        DeCareSharedUiPageShellBasicModule,
        DeCareUseCasesSharedUiShellBasicModule,
        SharedSxmUiUiPrivacyPolicyModule,
        DomainsChatUiChatWithAgentLinkModule        
    ],
    declarations: [UnauthenticatedLandingPageComponent, AuthenticatedLandingPageComponent, TextMessageSentConfirmationPageComponent],
})
export class DeCareUseCasesSubscriptionFeatureRefreshRadioSignalModule {}
