import { NgModule } from '@angular/core';
import { FormControlInvalidPipe } from './form-control-invalid.pipe';

@NgModule({
    declarations: [FormControlInvalidPipe],
    exports: [FormControlInvalidPipe]
})
export class SharedValidationFormControlInvalidModule {}
