import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SxmUiContentCardComponent } from './content-card/content-card.component';

@NgModule({
    imports: [CommonModule],
    declarations: [SxmUiContentCardComponent],
    exports: [SxmUiContentCardComponent]
})
export class SharedSxmUiUiContentCardModule {}
