import { Component, ChangeDetectionStrategy, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { getSubscriptionId } from '@de-care/de-care-use-cases/cancel-subscription/state-cancel-request';
import { Observable } from 'rxjs';
import { StreamingPlayerLinkComponentApi } from '@de-care/domains/subscriptions/ui-player-app-integration';
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-interstitial-blocks',
    templateUrl: './interstitial-channel-blocks.component.html',
    styleUrls: ['./interstitial-channel-blocks.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterstitialChannelBlocksComponent implements ComponentWithLocale, OnInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    subscriptionId$: Observable<number>;
    @ViewChild('player') streamingLinkPlayer: StreamingPlayerLinkComponentApi;
    @Output() public continueToNext = new EventEmitter();

    images = [];
    imagesText = [];
    constructor(readonly translationsForComponentService: TranslationsForComponentService, private readonly _store: Store) {
        this.subscriptionId$ = this._store.select(getSubscriptionId);
        translationsForComponentService.init(this);
    }
    ngOnInit(): void {
        this.imagesText = Array(9)
            .fill('0')
            .map((_, idx) => `CAROUSEL_IMAGE_${idx + 1}`);
        this.images = this.imagesText.map((image) => this.translationsForComponentService.instant(`${this.translateKeyPrefix}.${image}`));
    }

    listenOnImageClick() {
        this.streamingLinkPlayer.clickLink();
    }

    continue() {
        this.continueToNext.emit();
    }
}
