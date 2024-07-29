import { Component, Input, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { UserSettingsService, SettingsService, CURRENCY_PIPE_ZERO_DECIMAL_NUMBER_FORMAT, CURRENCY_PIPE_TWO_DECIMAL_NUMBER_FORMAT } from '@de-care/settings';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { OriginalPriceKey } from '@de-care/data-services';
import { startWith, pluck, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

export interface BetterPricingInfo {
    originalPrice: number;
    newPrice: number;
    originalTerm: number;
    newTerm: number;
    isFreeOffer: boolean;
    isMCP?: boolean;
    isPartnerIneligible?: boolean;
}

@Component({
    selector: 'better-pricing',
    templateUrl: './better-pricing.component.html',
    styleUrls: ['better-pricing.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BetterPricingComponent implements OnInit, OnDestroy {
    @Input() pricingInfo: BetterPricingInfo;
    currentLang: string;
    originalPriceKey: OriginalPriceKey;
    priceFormat: string;
    private _unsubscribe: Subject<void> = new Subject();

    constructor(private _userSettingsService: UserSettingsService, private _translateService: TranslateService, private _settingsService: SettingsService) {}

    ngOnInit() {
        this._listenForLang();
        this._listenForQuebec();
        this._setCurrencyFormat();
    }

    ngOnDestroy() {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private _listenForLang(): void {
        this._translateService.onLangChange
            .pipe(
                startWith({
                    lang: this._translateService.currentLang,
                    translations: null,
                } as LangChangeEvent),
                pluck('lang'),
                takeUntil(this._unsubscribe)
            )
            .subscribe((lang: string) => (this.currentLang = lang));
    }

    private _listenForQuebec() {
        this._userSettingsService.isQuebec$.pipe(takeUntil(this._unsubscribe)).subscribe((isQuebec: boolean) => {
            isQuebec ? (this.originalPriceKey = OriginalPriceKey.OriginalPriceQuebec) : (this.originalPriceKey = OriginalPriceKey.OriginalPrice);
        });
    }

    private _setCurrencyFormat(): void {
        this.priceFormat = this.pricingInfo.isFreeOffer ? CURRENCY_PIPE_ZERO_DECIMAL_NUMBER_FORMAT : CURRENCY_PIPE_TWO_DECIMAL_NUMBER_FORMAT;
    }
}
