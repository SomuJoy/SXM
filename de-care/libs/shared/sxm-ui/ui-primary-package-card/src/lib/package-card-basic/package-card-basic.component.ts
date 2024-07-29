import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { SharedSxmUiUiSafeHtmlModule } from '@de-care/shared/sxm-ui/ui-safe-html';

@Component({
    selector: 'sxm-ui-package-card-basic',
    template: `
        <div class="platform-plan" data-test="PackageCardBasicPlatformPlan" [innerHTML]="packageData.platformPlan | safeHtml"></div>
        <div class="price-term" data-test="PackageCardBasicPriceTerm" [innerHTML]="packageData.priceAndTermDescTitle | safeHtml"></div>
        <div class="legal" data-test="PackageCardBasicLegal" [innerHTML]="packageData.processingFeeDisclaimer | safeHtml"></div>
    `,
    styleUrls: ['./package-card-basic.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiPackageCardBasicComponent {
    @Input() packageData: {
        platformPlan: string;
        priceAndTermDescTitle: string;
        processingFeeDisclaimer: string;
    };
}

@NgModule({
    declarations: [SxmUiPackageCardBasicComponent],
    exports: [SxmUiPackageCardBasicComponent],
    imports: [SharedSxmUiUiSafeHtmlModule],
})
export class SxmUiPackageCardBasicComponentModule {}
