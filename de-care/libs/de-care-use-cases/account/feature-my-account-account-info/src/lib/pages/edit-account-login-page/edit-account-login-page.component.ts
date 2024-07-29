import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Inject } from '@angular/core';
import {
    getAccountUsername,
    UpdateAccountLoginInfoWorkflowError,
    UpdateAccountLoginInfoWorkflowService,
} from '@de-care/de-care-use-cases/account/state-my-account-account-info';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { SharedSxmUiEditLoginUsernamePasswordModule } from '@de-care/shared/sxm-ui/account/ui-account-information';
import { ToastNotificationService } from '@de-care/shared/sxm-ui/ui-toast-notification';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { ReactiveComponentModule } from '@ngrx/component';
import { select, Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

interface UsernamePasswordsModel {
    userName: string;
    password: string;
    oldPassword: string;
}

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'my-account-edit-account-login-page',
    templateUrl: './edit-account-login-page.component.html',
    styleUrls: ['./edit-account-login-page.component.scss'],
    standalone: true,
    imports: [TranslateModule, SharedSxmUiEditLoginUsernamePasswordModule, ReactiveComponentModule],
})
export class EditAccountLoginPageComponent implements ComponentWithLocale, AfterViewInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;

    usernamePasswordsDetails: UsernamePasswordsModel;
    editAccountLoginServerError: UpdateAccountLoginInfoWorkflowError;
    private readonly _window: Window;
    username$ = this._store.pipe(select(getAccountUsername));
    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _updateAccountLoginInfoWorkflowService: UpdateAccountLoginInfoWorkflowService,
        @Inject(DOCUMENT) private readonly _document: Document,
        private readonly _store: Store,
        private readonly _toastNotificationService: ToastNotificationService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        translationsForComponentService.init(this);
        this._window = this._document && this._document.defaultView;
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'editaccountlogin' }));
    }

    onBack(): void {
        // TODO: do we need a fallback here in case future version allows customer to land here initially without having gone to dashboard/subscription/account-info page
        this._window.history.back();
    }

    onEditAccountLoginFormSubmit(usernamePasswordDetails: UsernamePasswordsModel): void {
        this._updateAccountLoginInfoWorkflowService.build(usernamePasswordDetails).subscribe(
            () => {
                this._window.history.back();
                this._toastNotificationService.showNotification(this.translationsForComponentService.instant(`${this.translateKeyPrefix}.USERNAME_UPDATE_SUCCESS_MESAGE`));
            },
            (error: UpdateAccountLoginInfoWorkflowError) => {
                this.editAccountLoginServerError = error;
                this._changeDetectorRef.markForCheck();
            }
        );
    }
}
