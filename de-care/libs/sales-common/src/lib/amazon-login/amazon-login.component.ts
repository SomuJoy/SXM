import { Component, AfterViewInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit, Inject, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { fromEvent, Subscription } from 'rxjs';
import { filter, tap, take } from 'rxjs/operators';
import { buildAmazonLoginUrl } from '@de-care/domains/subscriptions/state-amazon-linking';

//wrapper for amazon response
export class AmazonAuthResponse {
    public authRequest: any;

    constructor(authRequest: any) {
        this.authRequest = authRequest;
    }
}

//wrapper for amazon login component from the Amazon Login SDK
@Component({
    selector: 'amazon-login',
    template: `
        <button class="link-with-amazon button secondary text-center align-justify full-width" (click)="onClick()" qatag="claimDeviceLink">
            {{ 'sales-common.claimDeviceComponent.WITH_LINK.LINK' | translate: { company: 'Amazon' } }}
        </button>
    `,
    styles: [
        `
            .link-with-amazon {
                margin-top: 24px;
            }
        `
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AmazonLoginComponent implements AfterViewInit, OnDestroy {
    private id: string = 'amazon-root';
    private _window: Window;
    private _messageSub: Subscription;

    constructor(@Inject(DOCUMENT) document: Document) {
        this._window = document && document.defaultView;
    }

    // Options
    @Input() clientId: string;
    @Input() sessionId: string;
    @Output() amazonAuthResponse: EventEmitter<AmazonAuthResponse> = new EventEmitter<AmazonAuthResponse>();

    ngAfterViewInit() {
        this.loginInit();

        this._messageSub = fromEvent(this._window, 'message')
            .pipe(
                filter((evt: MessageEvent) => evt.origin === this._window.location.origin && evt.data.code),
                take(1),
                tap(evt => {
                    this.amazonAuthResponse.emit(new AmazonAuthResponse({ code: evt.data.code }));
                })
            )
            .subscribe();
    }

    ngOnDestroy(): void {
        if (this._messageSub) {
            this._messageSub.unsubscribe();
        }
    }

    private loginInit() {
        // if (this.clientId == null) throw new Error('clientId property is necessary. (<amazon-login [clientId]="..."></amazon-login>)');
        // this._amazonLoginService.setClientId(this.clientId);
    }

    private handleResponse(response: any) {
        console.log(response);
        this.amazonAuthResponse.emit(new AmazonAuthResponse(response));
    }

    onClick() {
        // for testing locally
        // this.amazonAuthResponse.next(new AmazonAuthResponse({ type: 'mock', code: 'SplxlOBezQQYbYS6WxSbIA' })); //testing

        // MOCK test, opens a window with the amzauth route and a mock code (will ultimately fail authentication in the thanks page service call, becuase code is not valid)
        // const mockRedirectUri = `${this._window.location.origin}/amzauth?code=ANLPRNHnGOOOLgqPqeXf&scope=alexa%3A%3Askills%3Aaccount_linking&state=undefined`;
        // this._window.open(mockRedirectUri);

        const redirectUri = this._window.location.href.replace('subscribe/checkout/thanks', 'amzauth');
        this._window.open(buildAmazonLoginUrl(this.clientId, redirectUri, this.sessionId));

        // this._amazonLoginService.authorize(
        //     {
        //         scope: 'alexa::skills:account_linking',
        //         response_type: 'code',
        //         state: this.sessionId, //this is the http session id issued from microservices backend
        //         popup: true
        //     },
        //     (response: any) => this.handleResponse(response)
        // );
        /*
    amazon.Login.authorize({
      scope: 'profile',
      response_type: 'code',
      state: this.sessionId, //this is the http session id issued from microservices backend
      popup: true
    }, (response: amazon.Login.AuthorizeRequest) => this.handleResponse(response));
    */
    }
}
