import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SxmUiModalComponent } from './modal/modal.component';
import { A11yModule } from '@angular/cdk/a11y';

@NgModule({
    imports: [CommonModule, A11yModule],
    declarations: [SxmUiModalComponent],
    exports: [SxmUiModalComponent]
})
export class SharedSxmUiUiModalModule {}
