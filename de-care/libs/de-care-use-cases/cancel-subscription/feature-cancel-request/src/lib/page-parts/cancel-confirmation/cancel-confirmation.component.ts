import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, OnInit, Input, ChangeDetectionStrategy, Inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DomainsSubscriptionsUiPlayerAppIntegrationModule } from '@de-care/domains/subscriptions/ui-player-app-integration';
import { OAC_BASE_URL } from '@de-care/shared/configuration-tokens-oac';
import { SharedSxmUiUiContentCardModule } from '@de-care/shared/sxm-ui/ui-content-card';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
export interface CancellationDetails {
    cancellationNumber: string;
    creditRemainingOnAccount: number;
    refundAmount: number;
    amountDue: number;
}
export interface PlanInfo {
    isTrial: boolean;
    packageName: string;
    termLength: number;
    type: string;
    endDate: Date;
    followOnPlan?: PlanInfo;
    hasSubscriptionWithTrialAndFollowOn?: boolean;
    name?: string;
}

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-cancel-confirmation',
    templateUrl: './cancel-confirmation.component.html',
    standalone: true,
    styleUrls: ['./cancel-confirmation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, TranslateModule, DomainsSubscriptionsUiPlayerAppIntegrationModule, SharedSxmUiUiContentCardModule, SharedSxmUiUiProceedButtonModule, RouterModule],
})
export class CancelConfirmationComponent implements OnInit, ComponentWithLocale {
    dateFormat$: Observable<string> = this._translationForComponentService.dateFormat$;
    @Input() cancellationDetails: CancellationDetails;
    @Input() planInfo: PlanInfo;

    languageResources: LanguageResources;
    translateKeyPrefix: string;

    private readonly _window: Window;

    constructor(
        private translateService: TranslateService,
        private _translationForComponentService: TranslationsForComponentService,
        @Inject(OAC_BASE_URL) public readonly oacBaseUrl: string,
        @Inject(DOCUMENT) private readonly _document: Document,
        private readonly _router: Router
    ) {
        this._window = this._document && this._document.defaultView;
        _translationForComponentService.init(this);
    }

    ngOnInit(): void {}

    backToMyAccount() {
        // TODO we want to move away from using a isCanadaMode logic check here and instead either:
        // Leverage translate resource keys since that understands Ca or not (can have an entry key "BACK_TO_ACCOUNT": { "URL": "", "TYPE": "ROUTER" } and use TYPE of "ROUTER" or "EXTERNAL")
        // OR...have a feature state view model selector property to tell the UI how to handle backToMyAccount
        if (this.translateService.currentLang === 'en-CA') {
            this._window.location.href = `${this.oacBaseUrl}login_view.action?reset=true`;
        } else {
            this._window.location.href = this._window.location.href.replace(this._router.url, '/account/manage/dashboard');
        }
    }
}
