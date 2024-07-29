import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaskPhoneNumberDirective } from './mask-phone-number.directive';
import { MaskZipCodeDirective } from './mask-zip-code.directive';

@NgModule({
    imports: [CommonModule],
    declarations: [MaskPhoneNumberDirective, MaskZipCodeDirective],
    exports: [MaskPhoneNumberDirective, MaskZipCodeDirective]
})
export class SharedSxmUiUiFormFieldMasksModule {}
