import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotProgressBarComponent } from './dot-progress-bar/dot-progress-bar.component';

@NgModule({
    imports: [CommonModule],
    declarations: [DotProgressBarComponent],
    exports: [DotProgressBarComponent]
})
export class SharedSxmUiUiDotProgressBarModule {}
