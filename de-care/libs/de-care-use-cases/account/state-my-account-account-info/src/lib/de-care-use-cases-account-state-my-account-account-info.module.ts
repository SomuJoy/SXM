import { NgModule } from '@angular/core';
import { DomainsAccountStateAccountModule } from '@de-care/domains/account/state-account';
import { DomainsAccountStateAccountManagementModule } from '@de-care/domains/account/state-management';

@NgModule({
    imports: [DomainsAccountStateAccountModule, DomainsAccountStateAccountManagementModule],
})
export class DeCareUseCasesAccountStateMyAccountAccountInfoModule {}
