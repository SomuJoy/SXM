import { ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { concatMap, filter, map, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { fromEvent, of, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { DOCUMENT, LocationStrategy } from '@angular/common';
import { AmazonLoginService, buildAmazonLoginUrl } from '@de-care/domains/subscriptions/state-amazon-linking';

interface SubscriberInfo {
    subscriptionId: number;
    clientId: string;
    sessionId: string;
}

const amazonAuthPath = 'amzauth';

@Component({
    selector: 'redeem-and-link-with-amazon',
    templateUrl: './redeem-and-link-with-amazon.component.html',
    styleUrls: ['./redeem-and-link-with-amazon.component.scss'],
})
export class RedeemAndLinkWithAmazonComponent implements OnInit {
    translateKeyPrefix = 'DomainsSubscriptionsUiRedeemAndLinkWithAmazonModule.RedeemAndLinkWithAmazonComponent.';

    @Input() subscriberInfo: SubscriberInfo;

    private _window: Window;
    private _messageSub: Subscription;
    private _amazonAuthHref: string = '';
    constructor(
        private readonly _store: Store,
        private readonly _amazonLoginService: AmazonLoginService,
        private readonly _translateService: TranslateService,
        private _changeDetectorRef: ChangeDetectorRef,
        readonly locationStrategy: LocationStrategy,
        @Inject(DOCUMENT) document: Document
    ) {
        this._window = document && document.defaultView;
        const baseHref = locationStrategy.getBaseHref();
        const path = `${baseHref}${baseHref.endsWith('/') ? '' : '/'}${amazonAuthPath}`;
        this._amazonAuthHref = `${this._window.location.origin}${path.startsWith('/') ? '' : '/'}${path}`;
    }

    redemptionStatus = 'REDEEM';

    dealRedemptionInstructions$ = this._translateService.stream(this.translateKeyPrefix + 'DEAL_REDEMPTION_INSTRUCTIONS').pipe(
        map((dealRedemptionInstructions) => {
            return {
                title: dealRedemptionInstructions.TITLE,
                productImage: dealRedemptionInstructions?.['image']?.['src'],
                descriptions: [dealRedemptionInstructions.DESCRIPTION],
            };
        })
    );

    ngOnInit(): void {
        this._messageSub = fromEvent(this._window, 'message').subscribe();
        this._messageSub = fromEvent(this._window, 'message')
            .pipe(
                filter((evt: MessageEvent) => evt.origin === this._window.location.origin && evt.data.code),
                take(1),
                concatMap((evt) => {
                    if (evt?.data?.code) {
                        return this._amazonLoginService.authenticate({
                            authCode: evt.data.code,
                            subscriptionId: this.subscriberInfo.subscriptionId,
                            redirectUri: this._amazonAuthHref,
                        });
                    } else {
                        return of(null);
                    }
                })
            )
            .subscribe(
                (result) => {
                    if (result?.status === 'SUCCESS') {
                        this._updateStatus('SUCCESS');
                    } else {
                        this._updateStatus('ERROR');
                    }
                },
                () => {
                    this._updateStatus('ERROR');
                }
            );
    }

    private _updateStatus(status: string) {
        this.redemptionStatus = status;
        this._changeDetectorRef.markForCheck();
    }

    ngOnDestroy(): void {
        if (this._messageSub) {
            this._messageSub.unsubscribe();
        }
    }

    onCtaClicked() {
        this._window.open(buildAmazonLoginUrl(this.subscriberInfo.clientId, this._amazonAuthHref, this.subscriberInfo.sessionId));
    }
}
