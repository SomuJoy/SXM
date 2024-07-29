import { AfterViewInit, Component, Inject, OnDestroy } from '@angular/core';
import { fromEvent, Observable, of, Subscription } from 'rxjs';
import { concatMap, delay, filter, map, take, tap, withLatestFrom } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { LinkDeviceWorkflowService, getAmazonUri } from '@de-care/de-care-use-cases/third-party-linking/state-device-link-amazon';
import { behaviorEventImpressionForPage, behaviorEventInteractionAmazonSupportLinkClick } from '@de-care/shared/state-behavior-events';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';

@Component({
    selector: 'de-care-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements AfterViewInit, OnDestroy {
    translatePrefix = 'deCareUseCasesThirdPartyLinkingFeatureDeviceLinkAmazonModule.landingPageComponent';
    amazonLoginOpened$: Observable<boolean>;
    private readonly _window: Window;
    private _messageSub: Subscription;

    constructor(
        @Inject(DOCUMENT) document: Document,
        private readonly _store: Store,
        private readonly _linDeviceWorkflowService: LinkDeviceWorkflowService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute
    ) {
        this._window = document && document.defaultView;
        this.amazonLoginOpened$ = of(false).pipe(
            delay(2000),
            withLatestFrom(this._store.pipe(select(getAmazonUri))),
            take(1),
            tap(() => {
                this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'AcctLinking', componentKey: 'redirect2' }));
            }),
            map(([_, amazonUri]) => {
                this._window.open(amazonUri);
                return true;
            })
        );
    }

    ngAfterViewInit(): void {
        this._store.dispatch(pageDataFinishedLoading());
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'AcctLinking', componentKey: 'redirect1' }));
        this._messageSub = fromEvent(this._window, 'message')
            .pipe(
                filter((evt: MessageEvent) => evt.origin === this._window.location.origin && evt.data.code),
                take(1),
                concatMap(evt =>
                    this._linDeviceWorkflowService.build({ code: evt.data.code }).pipe(
                        map(success => {
                            if (success) {
                                // TODO: dispatch behavior event for 'amazon-idm-success' (include component name)
                                this._router.navigate(['./success'], { relativeTo: this._activatedRoute });
                            } else {
                                // TODO: dispatch behavior event for 'amazon-idm-error' (include component name)
                                this._router.navigate(['./error'], { relativeTo: this._activatedRoute });
                            }
                        })
                    )
                )
            )
            .subscribe();
    }

    ngOnDestroy(): void {
        if (this._messageSub) {
            this._messageSub.unsubscribe();
        }
    }

    onRedirectLinkClick() {
        this._store.pipe(select(getAmazonUri), take(1)).subscribe(amazonUri => {
            this._window.open(amazonUri);
        });
    }

    onSupportLinkClick() {
        this._store.dispatch(behaviorEventInteractionAmazonSupportLinkClick());
    }
}
