import { AfterViewInit, Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { RegisterCredentialsState } from '@de-care/domains/account/ui-register';
import { BehaviorSubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { PrintService } from '@de-care/shared/browser-common/window-print';

import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DomainsQuotesUiOrderSummaryModule } from '@de-care/domains/quotes/ui-order-summary';
import { DomainsAccountUiRegisterModule } from '@de-care/domains/account/ui-register';
import { DomainsSubscriptionsUiPlayerAppIntegrationModule } from '@de-care/domains/subscriptions/ui-player-app-integration';
import { DomainsDeviceUiRefreshDeviceModule } from '@de-care/domains/device/ui-refresh-device';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { getConfirmationPageViewModel, SubmitAccountRegistrationWorkflowService } from '@de-care/de-care-use-cases/checkout/state-add-radio-router';
import { ReactiveComponentModule } from '@ngrx/component';
import { Router } from '@angular/router';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-confirmation-page',
    templateUrl: './confirmation-page.component.html',
    styleUrls: ['./confirmation-page.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveComponentModule,
        DomainsQuotesUiOrderSummaryModule,
        DomainsAccountUiRegisterModule,
        DomainsSubscriptionsUiPlayerAppIntegrationModule,
        DomainsDeviceUiRefreshDeviceModule,
    ],
})
export class ConfirmationPageComponent implements ComponentWithLocale, AfterViewInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    confirmationViewModel$ = this._store.select(getConfirmationPageViewModel);
    registerCredentialsState = RegisterCredentialsState.All;
    registrationCompleted$ = new BehaviorSubject(false);
    constructor(
        private readonly _store: Store,
        private _printService: PrintService,
        private readonly _submitAccountRegistrationWorkflowService: SubmitAccountRegistrationWorkflowService,
        @Inject(DOCUMENT) document: Document,
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _router: Router
    ) {
        translationsForComponentService.init(this);
        document.body.scrollTop = 0;
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'confirmation' }));
    }

    onRegisterAccount(registerData) {
        this._submitAccountRegistrationWorkflowService.build(registerData).subscribe({
            next: () => {
                this.registrationCompleted$.next(true);
            },
            error: () => {
                // TODO: show system error
            },
        });
    }

    onPrintClick(): void {
        this._printService.print();
    }

    backToMyAccount() {
        this._router.navigate(['/account/manage']);
    }
}
