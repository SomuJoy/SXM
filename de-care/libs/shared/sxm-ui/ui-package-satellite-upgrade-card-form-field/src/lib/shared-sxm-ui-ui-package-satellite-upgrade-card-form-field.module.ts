import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiAccordionChevronModule } from '@de-care/shared/sxm-ui/ui-accordion-chevron';
import { SharedSxmUiUiContentCardModule } from '@de-care/shared/sxm-ui/ui-content-card';
import { SharedSxmUiUiPackageIconsModule } from '@de-care/shared/sxm-ui/ui-package-icons';
import { TranslateModule } from '@ngx-translate/core';
import { PackageSatelliteUpgradeCardFormFieldComponent } from './package-satellite-upgrade-card-form-field/package-satellite-upgrade-card-form-field.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        SharedSxmUiUiContentCardModule,
        SharedSxmUiUiAccordionChevronModule,
        SharedSxmUiUiPackageIconsModule,
    ],
    declarations: [PackageSatelliteUpgradeCardFormFieldComponent],
    exports: [PackageSatelliteUpgradeCardFormFieldComponent],
})
export class SharedSxmUiUiPackageSatelliteUpgradeCardFormFieldModule {}
