import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CURRENCY_PIPE_ZERO_DECIMAL_NUMBER_FORMAT, CURRENCY_PIPE_TWO_DECIMAL_NUMBER_FORMAT } from '@de-care/settings';

export interface DifferentChannels {
    descriptions: string[];
}

export interface PackageChannelInfo {
    includedChannels: DifferentChannels[];
    upsellPricePerMonth: number;
    offerPricePerMonth: number;
}

@Component({
    selector: 'more-content-upsell',
    templateUrl: './more-content-upsell.component.html',
    styleUrls: ['./more-content-upsell.component.scss']
})
export class MoreContentUpsellComponent implements OnInit, OnDestroy {
    @Input() set packageChannelInfo(info: PackageChannelInfo) {
        this._packageInfo = info;
        this.checked = false;
        this.handleUpgrade(this.checked);
        this.priceDiff = this.packageChannelInfo.upsellPricePerMonth || 0;
        if (this.packageChannelInfo && this.packageChannelInfo.upsellPricePerMonth && this.packageChannelInfo.offerPricePerMonth) {
            this.priceDiff = this._calcDifference(this.packageChannelInfo.upsellPricePerMonth, this.packageChannelInfo.offerPricePerMonth);
        }
    }
    @Output() upgrade = new EventEmitter<boolean>();
    @Output() requestUpgradeDetails = new EventEmitter();
    get packageChannelInfo(): PackageChannelInfo {
        return this._packageInfo;
    }
    checked = false;
    locale: string;
    priceFormat: string;
    priceDiff: number;
    private _packageInfo: PackageChannelInfo;
    private _unsubscribe: Subject<void> = new Subject();

    constructor(private _translateService: TranslateService) {}

    ngOnInit() {
        this._listenForLangChange();
        this._setPriceFormat;
    }

    ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private _listenForLangChange(): void {
        this._translateService.onLangChange.pipe(takeUntil(this._unsubscribe)).subscribe((changes: LangChangeEvent) => {
            this.locale = changes.lang;
            this._setPriceFormat();
        });
    }

    private _isWholeNumber(n: number): boolean {
        return n - Math.floor(n) === 0;
    }

    private _calcDifference(first: number, second: number): number {
        return first - second;
    }

    private _setPriceFormat(): void {
        if (this.packageChannelInfo && this.packageChannelInfo.upsellPricePerMonth) {
            this.priceFormat = this._isWholeNumber(this.packageChannelInfo.upsellPricePerMonth)
                ? CURRENCY_PIPE_ZERO_DECIMAL_NUMBER_FORMAT
                : CURRENCY_PIPE_TWO_DECIMAL_NUMBER_FORMAT;
        }
    }

    handleUpgrade(isChecked: boolean): void {
        this.checked = isChecked;
        this.upgrade.emit(this.checked);
    }
}
