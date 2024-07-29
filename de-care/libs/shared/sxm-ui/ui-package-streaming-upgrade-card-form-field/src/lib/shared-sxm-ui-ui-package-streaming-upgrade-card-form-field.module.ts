import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiAccordionChevronModule } from '@de-care/shared/sxm-ui/ui-accordion-chevron';
import { SharedSxmUiUiContentCardModule } from '@de-care/shared/sxm-ui/ui-content-card';
import { PackageStreamingUpgradeCardFormFieldComponent } from './package-streaming-upgrade-card-form-field/package-streaming-upgrade-card-form-field.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedSxmUiUiContentCardModule, SharedSxmUiUiAccordionChevronModule, TranslateModule.forChild()],
    declarations: [PackageStreamingUpgradeCardFormFieldComponent],
    exports: [PackageStreamingUpgradeCardFormFieldComponent],
})
export class SharedSxmUiUiPackageStreamingUpgradeCardFormFieldModule {}
