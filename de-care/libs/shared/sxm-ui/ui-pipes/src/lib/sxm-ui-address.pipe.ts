import { CommonModule } from '@angular/common';
import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { toTitleCase } from '@de-care/shared/browser-common/util-common';

interface Address {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zip: string;
}
@Pipe({
    name: 'sxmUiAddress',
})
export class SxmUiAddressPipe implements PipeTransform {
    transform(address: Address, useTitleCase = true): string {
        if (!address) {
            return;
        }
        return useTitleCase
            ? `${toTitleCase(address.addressLine1)} ${toTitleCase(address.addressLine2) ?? ''}\n${toTitleCase(address.city)} ${address.state} ${address.zip}`
            : `${address.addressLine1} ${address.addressLine2 ?? ''}\n${address.city} ${address.state} ${address.zip}`;
    }
}

@NgModule({
    imports: [CommonModule],
    declarations: [SxmUiAddressPipe],
    exports: [SxmUiAddressPipe],
})
export class SharedSxmUiUiAddressPipeModule {}
