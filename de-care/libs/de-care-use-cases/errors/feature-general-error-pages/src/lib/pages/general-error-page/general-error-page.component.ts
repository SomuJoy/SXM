import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, NgModule, AfterViewInit } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { SxmUiGeneralErrorScreenComponentModule } from '@de-care/shared/sxm-ui/errors/ui-error-screens';
import { RouterModule } from '@angular/router';
import { DeCareSharedUiPageShellBasicModule, PageShellBasicComponent, PageShellBasicRouteConfiguration } from '@de-care/de-care/shared/ui-page-shell-basic';
import { Store } from '@ngrx/store';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { DomainsChatUiChatWithAgentLinkModule } from '@de-care/domains/chat/ui-chat-with-agent-link';
import { TempIncludeGlobalStyleScriptCanActivateService, TurnOffFullPageLoaderCanActivateService } from '@de-care/de-care-use-cases/shared/ui-router-common';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-general-error-page',
    templateUrl: './general-error-page.component.html',
    styleUrls: ['./general-error-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralErrorPageComponent implements ComponentWithLocale, AfterViewInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;

    constructor(readonly translationsForComponentService: TranslationsForComponentService, private _store: Store) {
        translationsForComponentService.init(this);
    }

    ngAfterViewInit() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'GenericErrorPage' }));
    }
}

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        RouterModule.forChild([
            {
                path: '',
                component: PageShellBasicComponent,
                canActivate: [TempIncludeGlobalStyleScriptCanActivateService, TurnOffFullPageLoaderCanActivateService], // TEMP until we remove the full page loader stuff from the app level
                data: { pageShellBasic: { headerTheme: 'gray', allowProvinceBar: false } as PageShellBasicRouteConfiguration },
                children: [
                    {
                        path: '',
                        component: GeneralErrorPageComponent,
                    },
                ],
            },
        ]),
        DeCareSharedUiPageShellBasicModule,
        SxmUiGeneralErrorScreenComponentModule,
        DomainsChatUiChatWithAgentLinkModule,
    ],
    declarations: [GeneralErrorPageComponent],
    exports: [GeneralErrorPageComponent],
})
export class GeneralErrorPageComponentModule {}
