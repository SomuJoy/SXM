import { SxmUiAccordionChevronComponent } from './accordion-chevron/accordion-chevron.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedSxmUiUiIconDropdownArrowSmallModule } from '@de-care/shared/sxm-ui/ui-icon-dropdown-arrow-small';

const DECLARATIONS = [SxmUiAccordionChevronComponent];

@NgModule({
    imports: [CommonModule, SharedSxmUiUiIconDropdownArrowSmallModule],
    declarations: [...DECLARATIONS],
    exports: [...DECLARATIONS],
})
export class SharedSxmUiUiAccordionChevronModule {}
