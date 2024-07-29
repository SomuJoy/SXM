import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StreamingPlayerLinkTokenGlobalStateService, StreamingPlayerLinkUrlBuilderService } from '@de-care/domains/subscriptions/state-player-app-tokens';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateService } from '@ngx-translate/core';
import { IDENTITY_PARAMETERS, IdentityParameters } from '@de-care/shared/configuration-tokens-identity-parameter';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    template: `
        <ng-content></ng-content>
        <form method="POST" ngNoForm [target]="newWindowName" #form *ngIf="useTokenForm">
            <input type="hidden" name="token" #formTokenInput />
        </form>
    `,
    styles: [
        `
            :host {
                display: inline-block;
            }
        `,
    ],
    standalone: true,
    imports: [CommonModule, FormsModule],
})
export class StreamingPlayerLinkAnchorComponent implements ComponentWithLocale {
    translateKeyPrefix: string | undefined;
    languageResources: LanguageResources | undefined;
    newWindowName = 'playerWindow';
    useTokenForm = false;
    private _window: Window;
    private _tokenUrl = '';
    @Input() set href(value: string) {
        this._tokenUrl = this._streamingPlayerLinkUrlBuilderService.createUrl(value);
    }
    @ViewChild('form') private _formElement: ElementRef;
    @ViewChild('formTokenInput') private _formTokenInput: ElementRef;

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        @Inject(DOCUMENT) document: Document,
        private readonly _translateService: TranslateService,
        private readonly _streamingPlayerLinkUrlBuilderService: StreamingPlayerLinkUrlBuilderService,
        private readonly _streamingPlayerLinkTokenGlobalStateService: StreamingPlayerLinkTokenGlobalStateService,
        private readonly _elementRef: ElementRef,
        @Inject(IDENTITY_PARAMETERS) private readonly _identityParameters: IdentityParameters
    ) {
        translationsForComponentService.init(this);
        this._window = document?.defaultView;
    }

    @HostListener('click', ['$event']) onClick(event: Event) {
        event?.preventDefault();
        const target = this._elementRef?.nativeElement?.getAttribute('target');
        const href = this._elementRef?.nativeElement?.getAttribute('href');
        if (this._streamingPlayerLinkTokenGlobalStateService.credentialsNotSet) {
            const onboardingUrl = this._translateService.instant(`${this.translateKeyPrefix}.ONBOARDING_LINK`);
            if (this._identityParameters?.dtok) {
                this._window.open(`${onboardingUrl}&dtok=${this._identityParameters?.dtok}`, target || '_self');
            } else if (this._identityParameters?.radioid && this._identityParameters.act) {
                this._window.open(`${onboardingUrl}&radioid=${this._identityParameters?.radioid}&act=${this._identityParameters?.act}`, target || '_self');
            } else if (this._identityParameters?.atok) {
                this._window.open(`${onboardingUrl}&atok=${this._identityParameters?.atok}`, target || '_self');
            } else {
                this._window.open(onboardingUrl, target || '_self');
            }
        } /*else if (this._streamingPlayerLinkTokenGlobalStateService.token) {
            this.useTokenForm = true;
            if (target && target !== '_self') {
                // We need to open the new window prior to the async call to avoid browser pop up blockers
                //  (code that opens or targets a new window that is not a direct result of a user initiated event is considered at-risk by some browser rules)
                this._window.open(null, this.newWindowName);
            }
            const form = this._formElement.nativeElement;
            form.action = this._tokenUrl;
            this._formTokenInput.nativeElement.value = this._streamingPlayerLinkTokenGlobalStateService.token;
            form.submit();
        }*/ else {
            this._window.open(href || this._translateService.instant(`${this.translateKeyPrefix}.LISTEN_NOW_LINK`), target || '_self');
        }
    }
}
