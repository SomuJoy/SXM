import { NgModule } from '@angular/core';
import { TrimFormFieldDirective } from './trim-form-field-value.directive';

@NgModule({
    declarations: [TrimFormFieldDirective],
    exports: [TrimFormFieldDirective]
})
export class SharedSxmUiUiTrimFormFieldModule {}
