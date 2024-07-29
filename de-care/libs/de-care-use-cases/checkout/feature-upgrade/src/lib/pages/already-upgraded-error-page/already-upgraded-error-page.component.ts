import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import { finishPageLoading, getOACRedirectUrl, getRadioAndCurentPlanInfoForSelectedDeviceViewModel } from '@de-care/de-care-use-cases/checkout/state-upgrade';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { map, startWith, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, Observable, pipe } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-redeemed-error-page',
    templateUrl: './already-upgraded-error-page.component.html',
    styleUrls: ['./already-upgraded-error-page.component.scss'],
})
export class AlreadyUpgradedErrorPageComponent implements OnInit, AfterViewInit, ComponentWithLocale {
    translateKeyPrefix: string;
    heroViewModel$: Observable<any>;
    languageResources: LanguageResources;
    private readonly _window: Window;

    constructor(
        private readonly _store: Store,
        private readonly _translateService: TranslateService,
        readonly translationsForComponentService: TranslationsForComponentService,
        @Inject(DOCUMENT) private readonly _document: Document
    ) {
        translationsForComponentService.init(this);
        this.heroViewModel$ = this._translateService.stream(this.translateKeyPrefix + '.HERO').pipe(
            map((hero) => {
                return { title: hero.TITLE };
            })
        );
        this._window = this._document?.defaultView;
    }

    selectedDeviceSubscriptionViewModel$ = this._store.select(getRadioAndCurentPlanInfoForSelectedDeviceViewModel);
    currentLang$ = this._translateService.onLangChange.pipe(
        startWith({ lang: this._translateService.currentLang }),
        map(({ lang }) => lang)
    );

    ngOnInit(): void {
        this._store.dispatch(finishPageLoading());
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'CHECKOUT', componentKey: 'Already redeemed' }));
    }

    manageAccount() {
        combineLatest([this._store.select(getOACRedirectUrl), this.currentLang$])
            .pipe(take(1))
            .subscribe(([oacUrl, lang]) => {
                lang = lang?.substring(0, 2);
                const langPref = lang === 'en' ? '' : `&langpref=${lang}`;
                this._window.location.href = `${oacUrl}login_view.action?reset=true${langPref}`;
            });
    }
}
