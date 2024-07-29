import { NgModule } from '@angular/core';
import { DomainsAccountStateAccountModule } from '@de-care/domains/account/state-account';
import { DomainsAccountStateSecurityQuestionsModule } from '@de-care/domains/account/state-security-questions';
import { DomainsCustomerStateAddressVerificationModule } from '@de-care/domains/customer/state-customer-verification';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AppRedirectsEffects } from './state/app-redirects.effects';
import { FindAccountPageEffects } from './state/find-account-page.effects';
import { LoadInboundQueryParamsEffects } from './state/load-inbound-query-params.effects';
import { featureKey, reducer } from './state/reducer';
import { RegistrationEffects } from './state/registration.effects';
import { DomainsIdentityStateStreamingFlepzLookupModule } from '@de-care/domains/identity/state-streaming-flepz-lookup';
import { SharedStateSettingsModule } from '@de-care/shared/state-settings';
import { DomainsIdentityStateCredentialsRecoveryModule } from '@de-care/domains/identity/state-credentials-recovery';

@NgModule({
    imports: [
        StoreModule.forFeature(featureKey, reducer),
        EffectsModule.forFeature([FindAccountPageEffects, LoadInboundQueryParamsEffects, AppRedirectsEffects, RegistrationEffects]),
        DomainsAccountStateAccountModule,
        DomainsAccountStateSecurityQuestionsModule,
        DomainsCustomerStateAddressVerificationModule,
        DomainsIdentityStateStreamingFlepzLookupModule,
        SharedStateSettingsModule,
        DomainsIdentityStateCredentialsRecoveryModule,
    ],
})
export class DeStreamingOnboardingStateSetupCredentialsModule {}
