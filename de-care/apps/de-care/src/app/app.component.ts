import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef, Compiler, Injector } from '@angular/core';
import { Subject } from 'rxjs';
import { getSessionTimedOut } from '@de-care/shared/browser-common/state-session-tracker';
import { select, Store } from '@ngrx/store';
import { delay, takeUntil } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { selectPageDataIsLoading } from '@de-care/de-care/shared/state-loading';
import { routeAnimations } from '@de-care/shared/animations';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styles: [
        `
            .sxm-loader {
                position: fixed;
                width: 100%;
                height: 100%;
                z-index: 2147483638;
                background-color: white;
            }
            .sxm-loader mat-icon {
                width: 300px;
                height: 60px;
                position: absolute;
                margin: auto;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
            }
        `,
    ],
    animations: [routeAnimations],
})
export class AppComponent implements OnInit, OnDestroy, ComponentWithLocale {
    pageDataIsLoading$ = this._store.pipe(select(selectPageDataIsLoading), delay(0));
    @ViewChild('sessionTimeoutModal', { read: ViewContainerRef })
    sessionTimeoutModal!: ViewContainerRef;
    private _destroy$: Subject<boolean> = new Subject<boolean>();

    translateKeyPrefix: string;
    languageResources: LanguageResources;

    constructor(
        private _store: Store,
        private readonly _compiler: Compiler,
        private readonly _injector: Injector,
        private readonly _translationsForComponentService: TranslationsForComponentService
    ) {
        this._translationsForComponentService.init(this);
    }

    ngOnInit() {
        this._store.pipe(takeUntil(this._destroy$), select(getSessionTimedOut)).subscribe((timedOut) => {
            if (timedOut && !!this.sessionTimeoutModal) {
                this._showSessionTimeoutModal();
            }
        });
    }

    private async _showSessionTimeoutModal() {
        const { SessionTimeoutModalComponentModule } = await import('@de-care/de-care-use-cases/session/ui-session-timeout');
        const moduleFactory = await this._compiler.compileModuleAsync(SessionTimeoutModalComponentModule);
        const moduleRef = moduleFactory.create(this._injector);
        const componentFactory = moduleRef.instance.getComponent();
        this.sessionTimeoutModal.clear();
        this.sessionTimeoutModal.createComponent(componentFactory);
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    prepareRoute(outlet: RouterOutlet) {
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
    }
}
