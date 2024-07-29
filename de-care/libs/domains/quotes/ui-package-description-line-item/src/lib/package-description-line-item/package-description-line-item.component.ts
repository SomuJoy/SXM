import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

interface PackageDescriptionLineItem {
    titleE2e?: string;
    amountE2e?: string;
    amount?: string;
    shouldShowGiftCardQuote?: boolean;
    giftCardText?: string;
    shouldShowDetailPackageName?: boolean;
    shouldNotBoldPackageName?: boolean;
    detailPackageName?: string;
    shouldShowDetailDealType?: boolean;
    dealType?: string;
    previousBalance?: string;
    termAndPrice?: string;
    termAndPriceSubText?: string;
    shouldShowDetailDealTypeDetails?: boolean;
    dealTypeDetails?: string;
    shouldShowDetailTermAndPrice?: boolean;
}

@Component({
    selector: 'order-summary-package-description-line-item',
    templateUrl: './package-description-line-item.component.html',
    styleUrls: ['./package-description-line-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackageDescriptionLineItemComponent implements OnInit {
    @Input() vm: PackageDescriptionLineItem;

    constructor() {}

    ngOnInit(): void {}
}
