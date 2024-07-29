import { ChangeDetectionStrategy, Component, HostBinding, Input, NgModule } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { distinctUntilChanged, filter, map, tap } from 'rxjs/operators';
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'listen-now-inline',
    template: `
        <div class="left-content">
            <h4>{{ translateKeyPrefix + '.HEADLINE' | translate }}</h4>
            <p class="listen-now-component-subhead">{{ translateKeyPrefix + '.SUB_HEADLINE' | translate }}</p>
        </div>
        <streaming-player-link
            class="streaming-player-secondary"
            [infoForToken]="infoForToken"
            [customLink]="customLink"
            [customLinkText]="translateKeyPrefix + '.LINK_TEXT' + ((isSoSmallBreakPoint$ | async) ? '_SO_SMALL' : '') | translate"
            [isButton]="true"
        ></streaming-player-link>
    `,
    styleUrls: ['./listen-now-inline.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListenNowInlineComponent implements ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;

    readonly isSoSmallBreakPoint$ = this.breakpointObserver.observe(['(max-width: 374px)']).pipe(map((data) => data.matches));

    constructor(private readonly breakpointObserver: BreakpointObserver, readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }

    @Input() customLink: string;
    @Input() infoForToken: { subscriptionId: string; useCase: string } = null;
}
