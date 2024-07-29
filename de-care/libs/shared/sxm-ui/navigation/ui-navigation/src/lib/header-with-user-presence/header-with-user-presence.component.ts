import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, ViewChild, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SxmUiAccountPresenceIconModule } from '../account-presence-icon/account-presence-icon.component';
import { SxmUiNavDropdownComponent, SxmUiNavDropdownModule } from '../nav-dropdown/nav-dropdown.component';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { SxmUiMyAccountPanelLoggedInComponentModule } from '../my-account-panel-logged-in/my-account-panel-logged-in.component';
import { FullBrowserRedirect } from '@de-care/shared/browser-common/util-redirect';

export interface SxmUiHeaderWithUserPresenceComponentApi {
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
    selector: 'sxm-ui-header-with-user-presence',
    templateUrl: './header-with-user-presence.component.html',
    styleUrls: ['./header-with-user-presence.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiHeaderWithUserPresenceComponent implements ComponentWithLocale, SxmUiHeaderWithUserPresenceComponentApi {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    @Input() name: string;
    private readonly _window: Window;
    @ViewChild('user') private readonly _userDropdownComponent: SxmUiNavDropdownComponent;

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _fullBrowserRedirect: FullBrowserRedirect,
        @Inject(DOCUMENT) document: Document
    ) {
        translationsForComponentService.init(this);
        this._window = document.defaultView;
    }

    closePanels(): void {
        this._userDropdownComponent.open = false;
    }

    logout() {
        this._window.location.href = this.translationsForComponentService.instant(`${this.translateKeyPrefix}.SXM_URL_LINK`);
    }
}

@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), SxmUiAccountPresenceIconModule, SxmUiNavDropdownModule, SxmUiMyAccountPanelLoggedInComponentModule],
    declarations: [SxmUiHeaderWithUserPresenceComponent],
    exports: [SxmUiHeaderWithUserPresenceComponent],
})
export class SxmUiHeaderWithUserPresenceModule {}
