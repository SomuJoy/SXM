import { CommonModule } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getAccountEmail, UpdateEbillEnrollmentAccountInfoWorkflowService } from '@de-care/de-care-use-cases/account/state-my-account-account-info';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { SharedSxmUiBillingEbillUpdateEmailComponentModule } from '@de-care/shared/sxm-ui/billing/ui-billing';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { ToastNotificationService } from '@de-care/shared/sxm-ui/ui-toast-notification';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import * as uuid from 'uuid/v4';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-my-account-update-ebill-email',
    templateUrl: './update-ebill-email.component.html',
    styleUrls: ['./update-ebill-email.component.scss'],
    standalone: true,
    imports: [CommonModule, TranslateModule, SharedSxmUiBillingEbillUpdateEmailComponentModule, SharedSxmUiUiModalModule],
})
export class UpdateEbillEmailComponent implements ComponentWithLocale, AfterViewInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    email$ = this._store.select(getAccountEmail);
    billingEbillUpdateEmailLoading = false;
    updateEmailServerError = false;
    updateEbillModalAriaDescribedbyTextId = uuid();

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _toastNotificationService: ToastNotificationService,
        private readonly _updateEbillEnrollmentAccountInfoWorkflowService: UpdateEbillEnrollmentAccountInfoWorkflowService,
        private readonly _store: Store
    ) {
        translationsForComponentService.init(this);
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Overlay:UpdateEmail' }));
    }

    closeEbillUpdateEmailModal() {
        this.billingEbillUpdateEmailLoading = false;
        this._router.navigate(['./'], { relativeTo: this._activatedRoute.parent });
    }

    onUpdateEmailId(email: string) {
        this.updateEmailServerError = false;
        this.billingEbillUpdateEmailLoading = true;
        const request = {
            email: email,
            ebillEnrollment: true,
        };
        this._updateEbillEnrollmentAccountInfoWorkflowService.build(request).subscribe(
            () => {
                this._toastNotificationService.showNotification(this.translationsForComponentService.instant(`${this.translateKeyPrefix}.EBILL_EMAIL_UPDATE_SUCCESS_MESAGE`));
                this.billingEbillUpdateEmailLoading = false;
                this.closeEbillUpdateEmailModal();
            },
            (error: any) => {
                this.billingEbillUpdateEmailLoading = false;
                this.updateEmailServerError = true;
            }
        );
    }
}
