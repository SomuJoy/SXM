import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageMainContentComponent } from './page-main-content/page-main-content.component';
import { PageFullWidthContentComponent } from './page-full-width-content/page-full-width-content.component';

@NgModule({
    imports: [CommonModule],
    declarations: [PageMainContentComponent, PageFullWidthContentComponent],
    exports: [PageMainContentComponent, PageFullWidthContentComponent],
})
export class DeCareSharedUiPageLayoutModule {}
