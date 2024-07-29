import { Component, Input } from '@angular/core';

export interface AccountInfoAndPaymentInfoWithQuotesLegacyExtraData {
    isBothRadios?: boolean;
    isPlatinumVIP?: boolean;
    showTotalAsPaid?: boolean;
    isUpgradePkg?: boolean;
    isAnnual?: boolean;
    isAcsc?: boolean;
    isFlepz?: boolean;
}

@Component({
    selector: 'quotes-with-loading-animation',
    styleUrls: ['./quotes-with-loading-animation.component.scss'],
    templateUrl: './quotes-with-loading-animation.component.html',
})
export class QuotesWithLoadingAnimationComponent {
    @Input() quoteSummaryInfo: {
        quoteViewModel?;
        legacySettings?: { isStreamingFlow: boolean; isNewAccount: boolean };
        extraData?: AccountInfoAndPaymentInfoWithQuotesLegacyExtraData;
        showUnusedCreditLine?: boolean;
        isQuebecProvince?: boolean;
    };
    @Input() quotesSkeletonTitle = '';
}
