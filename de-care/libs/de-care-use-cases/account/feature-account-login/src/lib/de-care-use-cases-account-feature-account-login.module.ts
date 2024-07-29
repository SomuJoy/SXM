import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { DeCareSharedUiPageShellBasicModule, PageShellBasicComponent, PageShellBasicRouteConfiguration } from '@de-care/de-care/shared/ui-page-shell-basic';
import { TranslateModule } from '@ngx-translate/core';
import { DomainsAccountUiLoginModule } from '@de-care/domains/account/ui-login';
import { DeCareUseCasesAccountStateAccountLoginModule } from '@de-care/de-care-use-cases/account/state-account-login';
import { LoginPageCanActivateService } from './pages/login-page/login-page-can-activate.service';
import { DomainsChatUiChatWithAgentLinkModule } from '@de-care/domains/chat/ui-chat-with-agent-link';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SharedSxmUiUiNotRegisteredInstructionsModule } from '@de-care/shared-sxm-ui-account-ui-registration-instructions';
import { TempIncludeGlobalStyleScriptCanActivateService, UpdateUsecaseCanActivateService } from '@de-care/de-care-use-cases/shared/ui-router-common';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { SharedSxmUiUiSafeHtmlModule } from '@de-care/shared/sxm-ui/ui-safe-html';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        RouterModule.forChild([
            {
                path: '',
                pathMatch: 'full',
                component: PageShellBasicComponent,
                data: { pageShellBasic: { headerTheme: 'black' } as PageShellBasicRouteConfiguration, useCaseKey: 'LOGIN' },
                canActivate: [TempIncludeGlobalStyleScriptCanActivateService, LoginPageCanActivateService, UpdateUsecaseCanActivateService],
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        component: LoginPageComponent,
                    },
                ],
            },
        ]),
        DeCareUseCasesAccountStateAccountLoginModule,
        DeCareSharedUiPageShellBasicModule,
        DomainsAccountUiLoginModule,
        SharedSxmUiUiNotRegisteredInstructionsModule,
        SharedSxmUiUiDataClickTrackModule,
        DomainsChatUiChatWithAgentLinkModule,
        SharedSxmUiUiModalModule,
        SharedSxmUiUiSafeHtmlModule,
    ],
    declarations: [LoginPageComponent],
})
export class DeCareUseCasesAccountFeatureAccountLoginModule {}
