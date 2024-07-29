import { Component, ChangeDetectionStrategy, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getAccountInfoViewModel, SubmitZeroCostCheckoutWorkflowErrors, SubmitZeroCostCheckoutWorkflowService } from '@de-care/de-care-use-cases/checkout/state-zero-cost';
import { AccountInfoFormComponent, AccountInfoFormComponentApi } from '@de-care/de-care-use-cases/checkout/ui-common';
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
    selector: 'step-account-info-page',
    templateUrl: './step-account-info-page.component.html',
    styleUrls: ['./step-account-info-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepAccountInfoPageComponent implements ComponentWithLocale, AfterViewInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    viewModel$ = this._store.select(getAccountInfoViewModel);
    @ViewChild(AccountInfoFormComponent) private readonly _accountInfoFormComponent: AccountInfoFormComponentApi;

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _store: Store,
        private readonly _submitZeroCostCheckoutWorkflowService: SubmitZeroCostCheckoutWorkflowService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute
    ) {
        translationsForComponentService.init(this);
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'stepaccountinfo' }));
    }

    formSubmit(data) {
        this._submitZeroCostCheckoutWorkflowService.build({ ...data }).subscribe({
            next: () => {
                this._router.navigate(['../device-activation'], { relativeTo: this._activatedRoute }).then(() => {
                    this._accountInfoFormComponent.setProcessingCompleted();
                });
            },
            error: (error: SubmitZeroCostCheckoutWorkflowErrors) => {
                this._accountInfoFormComponent.setProcessingCompleted();
                switch (error) {
                    case 'PROMO_CODE_EXPIRED': {
                        // TODO: should we redirect to promo code expired page at this point?
                        break;
                    }
                    case 'EMAIL_IN_USE': {
                        this._accountInfoFormComponent.showEmailInUseError();
                        break;
                    }
                    case 'EMAIL_NOT_ALLOWED': {
                        this._accountInfoFormComponent.showEmailNotAllowedError();
                        break;
                    }
                    case 'SYSTEM': {
                        this._accountInfoFormComponent.showUnexpectedSubmissionError();
                        break;
                    }
                }
            },
        });
    }
}
