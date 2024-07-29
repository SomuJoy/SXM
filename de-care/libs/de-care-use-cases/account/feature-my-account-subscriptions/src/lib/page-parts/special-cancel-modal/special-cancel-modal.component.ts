import { Component, AfterViewInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getSelectedSubscriptionId } from '@de-care/de-care-use-cases/account/state-my-account';
import { OAC_BASE_URL } from '@de-care/shared/configuration-tokens-oac';
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
    selector: 'my-account-special-cancel-modal',
    templateUrl: './special-cancel-modal.component.html',
    styleUrls: ['./special-cancel-modal.component.scss'],
})
export class SpecialCancelModalComponent implements ComponentWithLocale, AfterViewInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    selectedSubscriptionId$ = this._store.select(getSelectedSubscriptionId);
    currentLanguage$ = this.translationsForComponentService.currentLang$;
    //TODO: Investigate currentLanguage$ is always returning first value.
    cancelByPhone = this.translationsForComponentService.currentLang === 'fr-CA';

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _store: Store,
        @Inject(OAC_BASE_URL) public readonly oacBaseUrl: string
    ) {
        translationsForComponentService.init(this);
    }

    ngAfterViewInit(): void {
        // the old modal pattern. When modal pattern is udpated in the flow, tracking should be done in the inner components.
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'overlay:cancel_account_past_due' }));
    }

    navigateToMakeAPayment() {
        this._router.navigate(['account', 'pay', 'make-payment']);
    }
    onClosed() {
        this._router.navigate([{ outlets: { modal: null } }], { relativeTo: this._activatedRoute.parent });
    }
}
