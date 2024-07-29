import { Injectable, EventEmitter, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Event as NavEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, Router, RoutesRecognized } from '@angular/router';
import { map, filter, take, withLatestFrom } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { LANGUAGE_CODES } from '@de-care/shared/translation';
import { CountrySettingsToken, COUNTRY_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
// TODO: figure out how to remove these
import { UserSettingsService } from '@de-care/settings';
import { pageDataStartedLoading, selectRouteEventLoadingDisabled } from '@de-care/de-care/shared/state-loading';

enum NavigationState {
    STARTED,
    ENDED,
    FAILED,
    ROUTESRECOGNIZED,
}

export interface AppServiceNavObsData {
    event: NavEvent;
    navState: NavigationState;
}

@Injectable({
    providedIn: 'root',
})
export class AppService {
    public onLangChanged: EventEmitter<string> = new EventEmitter<string>();
    public navState$: Observable<AppServiceNavObsData>;

    constructor(
        private _titleSvc: Title,
        private _router: Router,
        @Inject(COUNTRY_SETTINGS) private readonly _countrySettings: CountrySettingsToken,
        private _userSettingsService: UserSettingsService,
        private readonly _store: Store
    ) {
        this.navState$ = this.startNavObs();
        this.navState$.subscribe();
    }

    set pageTitle(value: string) {
        this._titleSvc.setTitle(`${value}`);
    }

    private _normalizeLangPref(langPrefParam: string, failoverCountry?: string): string {
        const asArray = langPrefParam.split('-');
        const lang = asArray[0].toLowerCase();
        const country = asArray[1] ? asArray[1] : failoverCountry ? failoverCountry : '';
        return `${lang.toLowerCase()}-${country.toUpperCase()}`;
    }

    getLanguage(): Observable<string> {
        return this.navState$.pipe(
            filter((data) => data.navState === NavigationState.ROUTESRECOGNIZED),
            map((data) => {
                const event = data.event as RoutesRecognized;
                const country = this._countrySettings.countryCode.toUpperCase();

                const queryParamForLangPref = event.state.root.queryParamMap.keys.find((key) => key.toLowerCase() === 'langpref');
                let langPrefParam = queryParamForLangPref ? event.state.root.queryParamMap.get(queryParamForLangPref) : null;

                langPrefParam = langPrefParam ? this._normalizeLangPref(langPrefParam, country) : null;

                const languageCodeKey = !!langPrefParam && langPrefParam.replace('-', '_');
                const langFromUrl = !!langPrefParam && LANGUAGE_CODES[languageCodeKey.toUpperCase()];
                const locale = langFromUrl || LANGUAGE_CODES.DEFAULT[country];

                this._userSettingsService.setDateFormatBasedOnLocale(locale);

                return locale;
            }),
            take(1)
        );
    }

    scrollTop(to: number, duration: number, element = document.scrollingElement || document.documentElement): void {
        if (element.scrollTop === to) {
            return;
        }

        const start = element.scrollTop,
            change = to - start,
            startDate = +new Date();

        // t = current time; b = start value; c = change in value; d = duration
        const easeInOutQuad = (t, b, c, d) => {
            t /= d / 2;

            if (t < 1) {
                return (c / 2) * t * t + b;
            }

            t--;

            return (-c / 2) * (t * (t - 2) - 1) + b;
        };

        const animateScroll = function () {
            const currentDate = +new Date(),
                currentTime = currentDate - startDate;

            element.scrollTop = parseInt(easeInOutQuad(currentTime, start, change, duration), 10);

            if (currentTime < duration) {
                requestAnimationFrame(animateScroll);
            } else {
                element.scrollTop = to;
            }
        };

        animateScroll();
    }

    startNavObs(): Observable<AppServiceNavObsData> {
        return this._router.events.pipe(
            withLatestFrom(this._store.select(selectRouteEventLoadingDisabled)),
            map(([e, routeEventLoadingDisabled]) => {
                let navState: NavigationState;
                if (e instanceof NavigationStart) {
                    // Set loading state
                    document.body.classList.add('app-loading');
                    // leave this logic here until we are able to dispatch the loader actions in each use case lib
                    if (
                        !routeEventLoadingDisabled &&
                        !(e.url.includes('/subscribe/checkout/streaming') && (e.url.includes('&status=i') || e.url.includes('ineligibleForOffer=true')))
                    ) {
                        this._store.dispatch(pageDataStartedLoading());
                    }

                    navState = NavigationState.STARTED;
                }

                if (e instanceof RoutesRecognized) {
                    navState = NavigationState.ROUTESRECOGNIZED;
                }

                if (e instanceof NavigationEnd) {
                    // Scroll to top of the page
                    this.scrollTop(0, 0);
                    document.body.classList.remove('app-loading');
                    navState = NavigationState.ENDED;
                }

                if (e instanceof NavigationCancel || e instanceof NavigationError) {
                    // Remove loading state
                    navState = NavigationState.FAILED;
                }

                return {
                    event: e,
                    navState,
                };
            })
        );
    }
}
