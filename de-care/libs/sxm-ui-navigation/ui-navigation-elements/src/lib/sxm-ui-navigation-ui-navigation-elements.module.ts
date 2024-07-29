import { Inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    SxmUiHeaderWithUserPresenceModule,
    SxmUiNavWithUserPresenceModule,
    SxmUiAlertsIconModule,
    SxmUiAccountPresenceIconModule,
    SxmUiNavDropdownModule,
    SxmUiAlertsPanelLoadingSkeletonModule,
    SxmUiUserPanelLoadingSkeletonModule,
    SharedSxmUiMobileAppCtaModule,
    SharedSxmUiAccountPanelLoggedInModule,
    SharedSxmUiAlertsPanelLoggedInModule,
} from '@de-care/shared/sxm-ui/navigation/ui-navigation';
import { DomainsAccountUiLoginModule } from '@de-care/domains/account/ui-login';
import { MyAccountHeaderComponent } from './my-account-header/my-account-header.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TRANSLATION_SETTINGS, TranslationSettingsToken } from '@de-care/shared/configuration-tokens-locales';
import { AlertsIconWithPanelComponent } from './alerts-icon-with-panel/alerts-icon-with-panel.component';
import { AccountPanelNonPiiComponent } from './account-panel-non-pii/account-panel-non-pii.component';
import { AccountPanelNotLoggedInComponent } from './account-panel-not-logged-in/account-panel-not-logged-in.component';
import { AccountPresenceIconsComponent } from './account-presence-icons/account-presence-icons.component';
import { AlertsPanelNotLoggedInComponent } from './alerts-panel-not-logged-in/alerts-panel-not-logged-in.component';
import { SxmUiAccountAlertWithLinkCriticalIconModule, SxmUiAccountAlertWithNoLinkCheckmarkIconModule } from '@de-care/shared/sxm-ui/alerts/ui-account-alerts';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';
import { EffectsModule } from '@ngrx/effects';
import { DomainsDataLayerStateTrackingModule } from '@de-care/domains/data-layer/state-tracking';
import { StoreModule } from '@ngrx/store';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { AccountPresenceIconsWidgetComponent } from './account-presence-icons-widget/account-presence-icons-widget.component';
import { AccountIconsNoPresenceComponent } from './account-icons-no-presence/account-icons-no-presence.component';
import { AccountPanelWithLoginLinkComponent } from './account-panel-with-login-link/account-panel-with-login-link.component';
@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        SxmUiNavWithUserPresenceModule,
        SxmUiHeaderWithUserPresenceModule,
        SxmUiAlertsIconModule,
        SxmUiAccountPresenceIconModule,
        SxmUiNavDropdownModule,
        DomainsAccountUiLoginModule,
        SxmUiAccountAlertWithLinkCriticalIconModule,
        Angulartics2RouterlessModule.forRoot(),
        StoreModule.forRoot([]),
        EffectsModule.forRoot(),
        DomainsDataLayerStateTrackingModule,
        SharedSxmUiUiDataClickTrackModule,
        SxmUiAlertsPanelLoadingSkeletonModule,
        SxmUiAccountAlertWithNoLinkCheckmarkIconModule,
        SxmUiUserPanelLoadingSkeletonModule,
        SharedSxmUiMobileAppCtaModule,
        SharedSxmUiAccountPanelLoggedInModule,
        SharedSxmUiAlertsPanelLoggedInModule,
    ],
    declarations: [
        MyAccountHeaderComponent,
        AccountPresenceIconsWidgetComponent,
        AccountIconsNoPresenceComponent,
        AccountPanelWithLoginLinkComponent,
        AlertsIconWithPanelComponent,
        AccountPanelNotLoggedInComponent,
        AccountPanelNonPiiComponent,
        AccountPresenceIconsComponent,
        AlertsPanelNotLoggedInComponent,
    ],
    exports: [MyAccountHeaderComponent, AccountPresenceIconsComponent],
})
export class SxmUiNavigationUiNavigationElementsModule {
    constructor(readonly translateService: TranslateService, @Inject(TRANSLATION_SETTINGS) readonly translationSettings: TranslationSettingsToken) {
        const startingLangCode = translationSettings?.defaultLanguage || translationSettings?.languagesSupported?.[0];
        if (!translateService.defaultLang) {
            translateService.setDefaultLang(startingLangCode);
        }
        if (!translateService.currentLang) {
            translateService.use(startingLangCode);
        }
    }
}
