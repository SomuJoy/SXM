import { NgModule } from '@angular/core';
import { DomainsAccountStateAccountModule } from '@de-care/domains/account/state-account';
import { DomainsDeviceStateDeviceValidateModule } from '@de-care/domains/device/state-device-validate';

@NgModule({
    imports: [DomainsAccountStateAccountModule, DomainsDeviceStateDeviceValidateModule],
})
export class DomainsAccountStateAccountAndDeviceModule {}
