import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, Input, NgModule } from '@angular/core';
import { DomainsAccountUiLoginModule } from '@de-care/domains/account/ui-login';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'login-form-widget',
    template: `<ng-container *ngIf="redirectUri; else componentError">
            <login-form
                (fetchedAccountNumber)="onLoginFetchedAccountNumber()"
                [submitButtonTextOverride]="submitButtonTextOverride"
                [prefillUsernameValue]="usernameToPrefill"
            ></login-form>
            <p class="no-margin">
                {{ translateKeyPrefix + '.SIGN_IN_FORM_TITLE' | translate }}
                <a data-link-name="Register" sxmUiDataClickTrack="exit" [href]="registrationUri">{{ translateKeyPrefix + '.REGISTRATION_LINK_TEXT' | translate }}</a>
            </p>
        </ng-container>
        <ng-template #componentError>
            <strong>Login form component usage error:</strong>
            <br />The attribute <em>redirect-uri</em> is required on the element.
            <pre>&lsaquo;sxm-ui-login-form redirect-uri="https://accountpage"&rsaquo;</pre>
        </ng-template>`,
    styleUrls: ['./login-form-widget.component.scss'],
})
export class LoginFormWidgetComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    @Input() redirectUri = '';
    @Input() registrationUri = '';
    @Input() usernameToPrefill = '';
    @Input() submitButtonTextOverride = '';
    private _location: Location | undefined;

    constructor(readonly translationsForComponentService: TranslationsForComponentService, @Inject(DOCUMENT) readonly document: Document) {
        translationsForComponentService.init(this);
        this._location = document.defaultView?.location;
    }

    onLoginFetchedAccountNumber() {
        if (this._location && this.redirectUri) {
            this._location.href = this.redirectUri;
        }
    }
}

@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), DomainsAccountUiLoginModule, SharedSxmUiUiDataClickTrackModule],
    declarations: [LoginFormWidgetComponent],
    exports: [LoginFormWidgetComponent],
})
export class LoginFormWidgetComponentModule {}
