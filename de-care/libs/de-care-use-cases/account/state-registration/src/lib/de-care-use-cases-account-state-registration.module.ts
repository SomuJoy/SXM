import { RegistrationEffects } from './state/registration.effects';
import { DomainsCustomerStateAddressVerificationModule } from '@de-care/domains/customer/state-customer-verification';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DomainsAccountStateCustomerAccountsModule } from '@de-care/domains/account/state-customer-accounts';
import { SharedStateSettingsModule } from '@de-care/shared/state-settings';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CNAEffects } from './state/cna.effects';
import { RegistrationFlepzSubmissionEffects } from './state/flepz-submission.effects';
import { LookupEffects } from './state/lookup.effects';
import { reducer, registrationFeatureKey } from './state/reducer';
import { VerificationEffects } from './state/verification.effects';
import { DomainsAccountStateAccountModule } from '@de-care/domains/account/state-account';
import { RegisteredEffects } from './state/registered.effects';

@NgModule({
    imports: [
        RouterModule,
        SharedStateSettingsModule,
        DomainsAccountStateCustomerAccountsModule,
        DomainsCustomerStateAddressVerificationModule,
        DomainsAccountStateAccountModule,
        StoreModule.forFeature(registrationFeatureKey, reducer),
        EffectsModule.forFeature([RegistrationFlepzSubmissionEffects, VerificationEffects, LookupEffects, RegistrationEffects, CNAEffects, RegisteredEffects]),
    ],
})
export class DeCareUseCasesAccountStateRegistrationModule {}
