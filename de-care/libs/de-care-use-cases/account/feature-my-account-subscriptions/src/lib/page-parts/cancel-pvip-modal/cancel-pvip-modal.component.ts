import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { CancelSummaryNavigateService } from '../../cancelSummaryNavigateService';
import { getPackageDescriptionName } from '@de-care/de-care-use-cases/account/state-my-account-subscriptions';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'my-account-cancel-pvip-modal',
    templateUrl: './cancel-pvip-modal.component.html',
    styleUrls: ['./cancel-pvip-modal.component.scss'],
})
export class CancelPVIPModalComponent implements ComponentWithLocale, AfterViewInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    currentLanguage$ = this.translationsForComponentService.currentLang$;
    packageDescriptionName$ = this._store.select(getPackageDescriptionName);

    cancelByPhone = this.translationsForComponentService.currentLang === 'fr-CA';

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _store: Store,
        private _cancelSummaryNavigateService: CancelSummaryNavigateService
    ) {
        translationsForComponentService.init(this);
    }

    ngAfterViewInit(): void {
        // TODO: router-outlet modal pattern allows tracking directly child my-account-cancel-links-hybrid-bau. But My account flow is using
        // the old modal pattern. When modal pattern is udpated in the flow, tracking should be done in the inner components.
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'overlay:cancel_PVIP_2radios' }));
    }

    onClosed() {
        this._router.navigate([{ outlets: { modal: null } }], { relativeTo: this._activatedRoute.parent });
    }

    goToCancelSummary() {
        this._cancelSummaryNavigateService.goToCancelSummary();
    }
}
