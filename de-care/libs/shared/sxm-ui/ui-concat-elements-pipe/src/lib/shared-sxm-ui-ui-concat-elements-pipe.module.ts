import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConcatElementsPipe } from './concat-elements.pipe';

@NgModule({
    imports: [CommonModule],
    declarations: [ConcatElementsPipe],
    exports: [ConcatElementsPipe]
})
export class SharedSxmUiUiConcatElementsPipeModule {}
