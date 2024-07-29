import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiAccordionChevronModule } from '@de-care/shared/sxm-ui/ui-accordion-chevron';
import { SharedSxmUiUiContentCardModule } from '@de-care/shared/sxm-ui/ui-content-card';
import { TranslateModule } from '@ngx-translate/core';
import { SxmUiPackageTermUpgradeCardFormFieldComponent } from './package-term-upgrade-card-form-field/package-term-upgrade-card-form-field.component';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule.forChild(), SharedSxmUiUiContentCardModule, SharedSxmUiUiAccordionChevronModule],
    declarations: [SxmUiPackageTermUpgradeCardFormFieldComponent],
    exports: [SxmUiPackageTermUpgradeCardFormFieldComponent],
})
export class SharedSxmUiUiPackageTermUpgradeCardFormFieldModule {}
