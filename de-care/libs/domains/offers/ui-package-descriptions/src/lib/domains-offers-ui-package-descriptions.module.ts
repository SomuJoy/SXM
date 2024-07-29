import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateOfferNamePipe } from './translate-offer-name-pipe/translate-offer-name.pipe';
import { TranslateOfferIsAdvantagePipe } from './translate-offer-is-advantage-pipe/translate-offer-is-advantage.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateOfferPromoFooterPipe } from './translate-offer-promo-footer-pipe/translate-offer-promo-footer.pipe';

@NgModule({
    imports: [CommonModule, TranslateModule.forChild()],
    declarations: [TranslateOfferNamePipe, TranslateOfferPromoFooterPipe, TranslateOfferIsAdvantagePipe],
    exports: [TranslateOfferNamePipe, TranslateOfferPromoFooterPipe, TranslateOfferIsAdvantagePipe]
})
export class DomainsOffersUiPackageDescriptionsModule {}
