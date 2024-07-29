import { Component, Inject, ViewChild } from '@angular/core';
import { SxmUiNavDropdownComponent } from '@de-care/shared/sxm-ui/navigation/ui-navigation';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { NavigationElementsBaseUrls, NAVIGATION_ELEMENTS_BASE_URLS } from '../tokens';

export interface AccountIconsNoPresenceComponentApi {
    closePanels: () => void;
}

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'account-icons-no-presence',
    template: `
        <sxm-ui-nav-dropdown
            #alerts
            [open]="false"
            [align]="'right'"
            [arrowColor]="'#ffffff'"
            (isOpened)="onAlertsOpened()"
            [buttonAriaLabel]="translateKeyPrefix + '.ALERTS_BUTTON_ARIA' | translate"
            [buttonLinkKey]="'Global Nav'"
            [buttonLinkName]="'Snapshot Alert Icon'"
        >
            <ng-container toggler>
                <sxm-ui-alerts-icon></sxm-ui-alerts-icon>
            </ng-container>
            <ng-container content>
                <alerts-panel-not-logged-in (signInClicked)="onSignInClicked()"></alerts-panel-not-logged-in>
            </ng-container>
        </sxm-ui-nav-dropdown>
        <sxm-ui-nav-dropdown
            #user
            [open]="false"
            [align]="'right'"
            [arrowColor]="'#ffffff'"
            (isOpened)="onUserOpened()"
            [buttonAriaLabel]="translateKeyPrefix + '.USER_BUTTON_ARIA' | translate"
            [buttonLinkKey]="'Global Nav'"
            [buttonLinkName]="'Snapshot User Icon'"
        >
            <ng-container toggler>
                <sxm-ui-account-presence-icon [loggedIn]="false"></sxm-ui-account-presence-icon>
            </ng-container>
            <ng-container content>
                <account-panel-with-login-link></account-panel-with-login-link>
            </ng-container>
        </sxm-ui-nav-dropdown>
    `,
    styleUrls: ['./account-icons-no-presence.component.scss'],
})
export class AccountIconsNoPresenceComponent implements ComponentWithLocale, AccountIconsNoPresenceComponentApi {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    canLogin = true;

    @ViewChild('alerts') private readonly _alertsDropdownComponent: SxmUiNavDropdownComponent;
    @ViewChild('user') private readonly _userDropdownComponent: SxmUiNavDropdownComponent;

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        @Inject(NAVIGATION_ELEMENTS_BASE_URLS) public readonly baseUrls: NavigationElementsBaseUrls
    ) {
        translationsForComponentService.init(this);
    }

    closePanels(): void {
        this._userDropdownComponent.open = false;
        this._alertsDropdownComponent.open = false;
    }

    onAlertsOpened() {
        this._userDropdownComponent.open = false;
    }

    onUserOpened() {
        this._alertsDropdownComponent.open = false;
    }

    onSignInClicked() {
        this._alertsDropdownComponent.open = false;
        this._userDropdownComponent.open = true;
    }
}
