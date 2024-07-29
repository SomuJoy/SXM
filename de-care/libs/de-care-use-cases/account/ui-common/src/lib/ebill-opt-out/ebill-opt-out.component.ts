import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getAccountEmail, UpdateEbillEnrollmentAccountInfoWorkflowService } from '@de-care/de-care-use-cases/account/state-my-account-account-info';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { SharedSxmUiBillingEbillOptOutComponentModule } from '@de-care/shared/sxm-ui/billing/ui-billing';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { TranslateModule } from '@ngx-translate/core';
import { ToastNotificationService } from '@de-care/shared/sxm-ui/ui-toast-notification';
import * as uuid from 'uuid/v4';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-my-account-ebill-opt-out',
    templateUrl: './ebill-opt-out.component.html',
    styleUrls: ['./ebill-opt-out.component.scss'],
    standalone: true,
    imports: [CommonModule, TranslateModule, SharedSxmUiBillingEbillOptOutComponentModule, SharedSxmUiUiModalModule],
})
export class EbillOptOutComponent implements ComponentWithLocale, AfterViewInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    email$ = this._store.select(getAccountEmail);
    ebillOptOutLoading = false;
    optOutServerError = false;
    ebillOptOutModalAriaDescribedbyTextId = uuid();

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
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Overlay:OptOut' }));
    }

    closeEbillOptOutModal() {
        this.ebillOptOutLoading = false;
        this._router.navigate(['./'], { relativeTo: this._activatedRoute.parent });
    }

    onOptOut() {
        this.optOutServerError = false;
        this.ebillOptOutLoading = true;
        const request = {
            ebillEnrollment: false,
        };
        this._updateEbillEnrollmentAccountInfoWorkflowService.build(request).subscribe(
            () => {
                this._toastNotificationService.showNotification(
                    this.translationsForComponentService.instant(`${this.translateKeyPrefix}.EBILL_SWITCH_TO_PAPER_SUCCESS_MESAGE`)
                );
                this.ebillOptOutLoading = false;
                this.closeEbillOptOutModal();
            },
            (error: any) => {
                this.ebillOptOutLoading = false;
                this.optOutServerError = true;
            }
        );
    }
}
