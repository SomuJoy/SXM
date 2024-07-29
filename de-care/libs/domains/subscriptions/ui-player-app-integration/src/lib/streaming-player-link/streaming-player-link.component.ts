import { Component, Input, Inject, ViewChild, ElementRef, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { GenerateTokenForSubscriptionWorkflowService } from '@de-care/domains/subscriptions/state-player-app-tokens';
import { SmartLinkUrls, SMART_LINK_URLS } from '@de-care/shared/configuration-tokens-smart-link';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subscription, Subject } from 'rxjs';
import { filter, withLatestFrom } from 'rxjs/operators';

export interface StreamingPlayerLinkComponentApi {
    clickLink(): void;
}
@Component({
    selector: 'streaming-player-link',
    template: `
        <a
            [sxmUiDataClickTrack]="value"
            class="{{ isButton ? 'button primary full-width button-link' : 'text-link' }}"
            [class.loading]="(processing$ | async) && isButton"
            [ngClass]="customLinkClasses"
            [attr.data-e2e]="dataE2e"
            (click)="linkClick$.next()"
            ><span data-id="link-label">{{ customLinkText || (translateKeyPrefix + 'LISTEN_NOW_LINK_TEXT' | translate) }}</span> <span></span><span></span><span></span
        ></a>

        <form method="POST" ngNoForm [target]="this.newWindowName" #form>
            <input type="hidden" name="token" #formTokenInput />
        </form>
    `,
    styleUrls: ['./streaming-player-link.component.scss'],
})
export class StreamingPlayerLinkComponent implements AfterViewInit, StreamingPlayerLinkComponentApi, OnDestroy, OnInit {
    @Input() dataE2e = 'StreamingPlayerLink';
    @Input() customLinkText: string;
    /**
     * Used for custom link query param pieces for a smart.link URL (the URL now comes from settings)
     * @type {string}
     * @public
     */
    @Input() set customLink(value: string) {
        // Note - this is for custom link query param pieces (the URL now comes from settings)
        if (value?.startsWith('?')) {
            // Custom link is for smart.link and needs to include a mock value for ALC since this is used when not using the token service
            this._customLink = `${this._smartLinkUrls.toPlayer}${value}&ALC=0`;
            // Custom link for token is for smart.link that we pass to the token service without an ALC param since the external source for processing the token handles that
            this._customLinkForToken = `${this._smartLinkUrls.toPlayer}${value}`;
        } else {
            this._customLink = value;
        }
    }
    @Input() customLinkClasses: string[] = [];
    @Input() isButton = false;
    @Input() infoForToken: { subscriptionId: string; useCase: string } = null;
    @Input() useCurrentWindow = false;
    @Input() source;

    private _customLink: string;
    private _customLinkForToken: string;

    readonly translateKeyPrefix = 'DomainsSubscriptionsUiPlayerAppIntegrationModule.StreamingPlayerLinkComponent.';
    processing$ = new BehaviorSubject(false);
    linkClick$ = new Subject();
    private _linkClickSubscription: Subscription;
    private _window: Window;
    @ViewChild('form') private _formElement: ElementRef;
    @ViewChild('formTokenInput') private _formTokenInput: ElementRef;
    private _form: HTMLFormElement;
    private _tokenInput: HTMLInputElement;
    newWindowName = 'playerWindow';
    value: any;

    constructor(
        @Inject(DOCUMENT) document: Document,
        private readonly _translateService: TranslateService,
        private readonly _generateTokenForSubscriptionWorkflowService: GenerateTokenForSubscriptionWorkflowService,
        @Inject(SMART_LINK_URLS) private readonly _smartLinkUrls: SmartLinkUrls
    ) {
        this._window = document?.defaultView;
    }
    clickLink(): void {
        this.linkClick$.next();
    }

    ngOnInit(): void {
        if (this.source === 'OAC') {
            this.value = 'exit';
        } else {
            this.value = 'player';
        }
    }

    ngAfterViewInit() {
        this._form = this._formElement.nativeElement;
        this._tokenInput = this._formTokenInput.nativeElement;
        this._linkClickSubscription = this.linkClick$
            .pipe(
                withLatestFrom(this.processing$),
                filter(([, processing]) => !processing)
            )
            .subscribe(() => this._onLinkClick());
    }

    ngOnDestroy(): void {
        if (this._linkClickSubscription) {
            this._linkClickSubscription.unsubscribe();
        }
    }

    private _onLinkClick() {
        if (this.infoForToken && this._customLinkForToken) {
            this.processing$.next(true);
            let newWin;
            if (this.useCurrentWindow) {
                this.newWindowName = '_self';
                newWin = this._window;
            } else {
                // We need to open the new window prior to the async call to avoid browser pop up blockers
                //  (code that opens or targets a new window that is not a direct result of a user initiated event is considered at-risk by some browser rules)
                newWin = this._window.open(null, this.newWindowName);
            }
            this._generateTokenForSubscriptionWorkflowService.build({ ...this.infoForToken, deeplinkUrl: this._customLinkForToken }).subscribe({
                next: (result) => {
                    if (!result?.url) {
                        this.processing$.next(false);
                        newWin.location.href = this._customLink;
                        return;
                    }
                    const { token, url } = result;
                    this._form.action = url;
                    this._tokenInput.value = token;
                    this._form.submit();
                    this.processing$.next(false);
                },
                error: () => {
                    this.processing$.next(false);
                    newWin.location.href = this._customLink;
                },
            });
        } else {
            this._window.open(this._customLink || this._translateService.instant(`${this.translateKeyPrefix}LISTEN_NOW_LINK`), this.useCurrentWindow ? '_self' : '_blank');
        }
    }
}
