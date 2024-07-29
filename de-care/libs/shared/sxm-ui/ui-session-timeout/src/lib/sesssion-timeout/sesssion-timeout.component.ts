import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-sesssion-timeout',
    templateUrl: './sesssion-timeout.component.html',
    styleUrls: ['./sesssion-timeout.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiSesssionTimeoutComponent implements ComponentWithLocale, AfterViewInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    private readonly _window: Window;

    constructor(
        @Inject(DOCUMENT) document: Document,
        private _activatedRoute: ActivatedRoute,
        private _store: Store,
        readonly translationsForComponentService: TranslationsForComponentService
    ) {
        this._window = document.defaultView;
        translationsForComponentService.init(this);
    }

    refresh(): void {
        // TODO: Change this logic so this component uses an @Output to emit the "refresh" request and then the consumer
        //       of this component can handle the behavior logic (doing the redirect, etc).
        //       This will reduce the coupling and complexity of this presentational component and make it more re-usable.
        const redirectUrl = this.getCaseInsensitiveParam(this._activatedRoute.snapshot.queryParamMap, 'redirectUrl');
        if (redirectUrl) {
            const url = new URL(redirectUrl);
            if (url.hostname.endsWith('siriusxm.com') || url.hostname.endsWith('siriusxm.ca')) {
                this._window.location.href = redirectUrl;
            } else {
                this._window.location.reload();
            }
        } else {
            this._window.location.reload();
        }
    }

    getCaseInsensitiveParam(paramMap: ParamMap, keyToFind: string): string | null {
        const key = paramMap.keys.find((k) => k.toLowerCase() === keyToFind.toLowerCase());
        return paramMap.get(key);
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'sessionTimeout' }));
    }
}

// TODO: move NgModule into this file for SCAM pattern
