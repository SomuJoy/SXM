import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SxmUiHeroComponent } from './hero/hero.component';

@NgModule({
    imports: [CommonModule],
    declarations: [SxmUiHeroComponent],
    exports: [SxmUiHeroComponent]
})
export class SharedSxmUiUiHeroModule {}
