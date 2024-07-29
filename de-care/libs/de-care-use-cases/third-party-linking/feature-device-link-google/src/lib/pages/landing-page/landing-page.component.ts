import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';
import { LinkDeviceWorkflowService } from '@de-care/de-care-use-cases/third-party-linking/state-device-link-google';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-google-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit, ComponentWithLocale, AfterViewInit {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    private readonly _window: Window;

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _store: Store,
        private readonly _linDeviceWorkflowService: LinkDeviceWorkflowService,
        @Inject(DOCUMENT) document: Document,
        public translate: TranslateService
    ) {
        translationsForComponentService.init(this);
        this._window = document?.defaultView;
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'redirect1' }));
        this._linDeviceWorkflowService
            .build()
            .pipe(
                map((success) => {
                    if (success) {
                        // TODO: dispatch behavior event for 'amazon-idm-success' (include component name)
                        // this._router.navigate(['./success'], { relativeTo: this._activatedRoute });
                    } else {
                        const translateUrl = this.translate.instant(this.translateKeyPrefix + '.ERROR_PAGE');
                        this._window.location.href = translateUrl;
                    }
                })
            )
            .subscribe();
    }

    ngOnInit(): void {}
}
