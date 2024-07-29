import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SxmLoadingIndicatorComponent } from './loading-indicator/loading-indicator.component';
import { SxmLoadingIndicatorDirective } from './loading-indicator/loading-indicator.directive';

const DECLARATIONS = [SxmLoadingIndicatorComponent, SxmLoadingIndicatorDirective];

@NgModule({
    imports: [CommonModule],
    declarations: [...DECLARATIONS],
    exports: [...DECLARATIONS]
})
export class SharedSxmUiUiLoadingIndicatorModule {}
