import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'listen-now-with-genre-selection',
    template: `
        <section>
            <h5>{{ translateKeyPrefix + 'HEADLINE' | translate }}</h5>
            <p class="text-color-gray-dark listen-now-component-subhead">{{ translateKeyPrefix + 'SUB_HEADLINE' | translate }}</p>
        </section>
        <ul>
            <li
                *ngFor="let genre of translateKeyPrefix + 'GENRES' | translate"
                (click)="selectGenre(genre)"
                [class.selected]="selectedGenre === genre"
                [innerHTML]="genre['TEXT']"
                sxmUiDataClickTrack="ui"
            ></li>
        </ul>
        <streaming-player-link
            [infoForToken]="infoForToken"
            [customLink]="selectedGenre?.URL || customLink"
            [customLinkText]="translateKeyPrefix + 'LINK_TEXT' | translate"
            [isButton]="true"
        ></streaming-player-link>
    `,
    styleUrls: ['./listen-now-with-genre-selection.component.scss'],
})
export class ListenNowWithGenreSelectionComponent {
    translateKeyPrefix = 'DomainsSubscriptionsUiPlayerAppIntegrationModule.ListenNowWithGenreSelectionComponent.';

    /**
     * Used for custom link query param pieces for a smart.link URL (the URL now comes from settings)
     * @type {string}
     * @public
     */
    @Input() customLink: string;
    @Input() infoForToken: { subscriptionId: string; useCase: string } = null;
    selectedGenre: { TEXT: string; URL: string };

    constructor(readonly translateService: TranslateService) {
        this.selectedGenre = translateService.instant(this.translateKeyPrefix + 'GENRES')?.[0];
    }

    selectGenre(genre: { TEXT: string; URL: string }) {
        this.selectedGenre = genre;
    }
}
