import { AfterViewInit, Component, Inject, OnDestroy, ViewChild } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';
import { DOCUMENT } from '@angular/common';
import { getRedirectInfo, getUsernameToPrefill } from '@de-care/de-care-use-cases/account/state-account-login';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements ComponentWithLocale, AfterViewInit, OnDestroy {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    usernameToPrefill$ = this._store.select(getUsernameToPrefill);
    private _window: Window;
    @ViewChild('partnerNotificationModal') private readonly _partnerNotificationModal: SxmUiModalComponent;
    @ViewChild('iaporfreetierPartnerNotificationModal') private readonly _iaporfreetierPartnerNotificationModal: SxmUiModalComponent;
    partnerName = '';
    private _translateSubscription: Subscription;

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _store: Store,
        @Inject(DOCUMENT) readonly document: Document,
        private readonly _router: Router,
        private _titleService: Title
    ) {
        translationsForComponentService.init(this);
        this._translateSubscription = this.translationsForComponentService.stream(`${this.translateKeyPrefix}.PAGE_TITLE`).subscribe((pageTitle) => {
            this._titleService.setTitle(pageTitle);
        });
        this._window = document.defaultView;
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'signin' }));
    }

    onPartnerLoginRequired({ partnerName, partnerType }: { partnerName: string; partnerType: string }) {
        this.partnerName = partnerName;
        if (partnerType === 'iaporfreetier') {
            this._iaporfreetierPartnerNotificationModal.open();
        } else {
            this._partnerNotificationModal.open();
        }
    }
    onLoginFetchedAccountNumber() {
        this._store
            .select(getRedirectInfo)
            .pipe(take(1))
            .subscribe((redirectInfo) => {
                if (redirectInfo?.url) {
                    if (redirectInfo.isRelative) {
                        this._router.navigate([redirectInfo.url], { queryParams: { redirect_uri: undefined }, queryParamsHandling: 'merge' });
                    } else {
                        this._window.location.href = redirectInfo.url;
                    }
                } else {
                    this._router.navigate(['/account/manage'], { queryParamsHandling: 'preserve' });
                }
            });
    }

    ngOnDestroy() {
        this._translateSubscription?.unsubscribe();
    }

    onLoginError() {
        this._router.navigate(['/error']);
    }
}
