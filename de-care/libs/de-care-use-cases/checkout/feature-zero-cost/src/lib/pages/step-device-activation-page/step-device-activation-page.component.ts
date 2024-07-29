import { Component, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { getActivateRadioViewModel, SubmitAccountRegistrationWorkflowService } from '@de-care/de-care-use-cases/checkout/state-zero-cost';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { RegisterCredentialsState } from '@de-care/domains/account/ui-register';
import { TranslateService } from '@ngx-translate/core';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'step-device-activation-page',
    templateUrl: './step-device-activation-page.component.html',
    styleUrls: ['./step-device-activation-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepDeviceActivationPageComponent implements ComponentWithLocale, AfterViewInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    refreshComplete$ = new BehaviorSubject(false);
    viewModel$ = combineLatest([this.refreshComplete$, this._store.select(getActivateRadioViewModel), this.translationsForComponentService.currentLang$]).pipe(
        map(([refreshComplete, viewModel, currentLang]) => ({
            ...viewModel,
            refreshComplete,
            registerCredentialsState: RegisterCredentialsState.PasswordOnly,
            currentLang,
        }))
    );
    registrationCompleted$ = new BehaviorSubject(false);

    constructor(
        private readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _store: Store,
        private readonly _translateService: TranslateService,
        private readonly _submitAccountRegistrationWorkflowService: SubmitAccountRegistrationWorkflowService
    ) {
        translationsForComponentService.init(this);
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'stepdeviceactivation' }));
    }

    // TODO: Look to make a domain ui widget for registration that can encapsulate the service calls so each feature state doesn't need to do that
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
}
