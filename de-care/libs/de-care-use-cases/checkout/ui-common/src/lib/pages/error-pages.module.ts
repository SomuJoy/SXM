import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedSxmUiUiLoadingWithAlertMessageModule } from '@de-care/shared/sxm-ui/ui-loading-with-alert-message';
import { TranslateModule } from '@ngx-translate/core';
import { BummerErrorComponentModule } from '../page-parts/bummer-error/bummer-error.component';
import { ExpiredOfferErrorPageComponent } from './expired-offer-error-page/expired-offer-error-page.component';
import { GenericErrorPageComponent } from './generic-error-page/generic-error-page.component';
import { IneligibleErrorPageComponent } from './ineligible-error-page/ineligible-error-page.component';
import { PromoCodeRedeemedErrorPageComponent } from './promo-code-redeemed-error-page/promo-code-redeemed-error-page.component';

const components = [ExpiredOfferErrorPageComponent, GenericErrorPageComponent, IneligibleErrorPageComponent, PromoCodeRedeemedErrorPageComponent];
@NgModule({
    declarations: [...components],
    exports: [...components],
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiLoadingWithAlertMessageModule, BummerErrorComponentModule],
})
export class ErrorPagesModule {}
