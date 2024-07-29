import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ErrorEffects } from './state/error-effects/error.effects';
import { ChatLinkRenderedEffects } from './state/impression-effects/chat-with-an-agent-link-effects/chat-link-rendered.effects';
import { ImpressionComponentEffects } from './state/impression-effects/impression-component.effects';
import { ImpressionPageEffects } from './state/impression-effects/impression-page.effects';
import { InteractionAccordionStepperEditClicked } from './state/interaction-effects/interaction-accordion-stepper-edit-clicked.effects';
import { InteractionAmazonSupportClicked } from './state/interaction-effects/interaction-amazon-support-link-clicked.effect';
import { InteractionButtonEffects } from './state/interaction-effects/interaction-button.effects';
import { InteractionEffectChevronClicked } from './state/interaction-effects/interaction-chevron-clicked.effects';
import { InteractionClickEffects } from './state/interaction-effects/interaction-click.effects';
import { InteractionVerificationOptionSelectedEffects } from './state/interaction-effects/interaction-verification-option-selected.effects';
import { InteractionEffects } from './state/interaction-effects/interaction.effects';
import { ReactionAccountInfoEffects } from './state/reaction-effects/account-info/reaction-account-info-effects';
import { ReactionStreamingCredentialsEffects } from './state/reaction-effects/account-info/reaction-streaming-credentials.effects';
import { ReactionAcscFailureEffects } from './state/reaction-effects/acsc-effects/acsc-failure.effects';
import { ReactionAcscSuccessEffects } from './state/reaction-effects/acsc-effects/acsc-success.effects';
import { AcscEffects } from './state/reaction-effects/acsc-effects/acsc.effects';
import { AppEnvironmentEffects } from './state/reaction-effects/app-environment/app-environment.effects';
import { ReactionCancelPlanReasonEffects } from './state/reaction-effects/cancel-plan-effects/reaction-cancel-plan-cancel-reason.effects';
import { ReactionChangePlanConversionTypeEffects } from './state/reaction-effects/change-plan-effects/reaction-change-plan-conversion-type.effect';
import { ReactionChangePlanEffects } from './state/reaction-effects/change-plan-effects/reaction-change-plan-error.effects';
import { AuthenticationTokenEffects } from './state/reaction-effects/customer-info-effects/authentication-token.effects';
import { CustomerTypeEffects } from './state/reaction-effects/customer-info-effects/customer-type.effects';
import { ReactionNumberOfAccountsFoundEffects } from './state/reaction-effects/customer-info-effects/number-of-accounts-found.effects';
import { PaymentMethodEffects } from './state/reaction-effects/customer-info-effects/payment-method.effect';
import { ReactionCustomerCoreInfoEffects } from './state/reaction-effects/customer-info-effects/reaction-customer-core-info.effects';
import { ReactionCustomerInfoAuthenticationTypeTypeEffects } from './state/reaction-effects/customer-info-effects/reaction-customer-info-authenticationType-type.effects';
import { ReactionSessionIdEffects } from './state/reaction-effects/customer-info-effects/reaction-session-id.effects';
import { ReactionTransactionIdEffects } from './state/reaction-effects/customer-info-effects/reaction-transaction-id.effects';
import { TransactionTypeEffects } from './state/reaction-effects/customer-info-effects/transaction-type.effects';
import { ReactionActiveSubscriptionEsnEffects } from './state/reaction-effects/device-info-effects/reaction-active-subscription-esn.effects';
import { ReactionActiveSubscriptionServiceIdEffects } from './state/reaction-effects/device-info-effects/reaction-active-subscription-service-id.effects';
import { ReactionDevicePromoCodeEffects } from './state/reaction-effects/device-info-effects/reaction-device-promo-code.effects';
import { ReactionActiveSubscriptionVinEffects } from './state/reaction-effects/device-info-effects/reaction-active-subscription-vin.effects';
import { ReactionNonPiiActiveSubscriptionStatusEffects } from './state/reaction-effects/device-info-effects/reaction-non-pii-active-subscription-status.effects';
import { ReactionSubscriptionIdEffects } from './state/reaction-effects/device-info-effects/reaction-subscription.effects';
import { FlepzLookupEffectsService } from './state/reaction-effects/flepz-effects/flepz-lookup-effects.service';
import { StreamingFlepzLookupEffectsService } from './state/reaction-effects/flepz-effects/streaming-flepz-lookup-effects.service';
import { NonPiiEffects } from './state/reaction-effects/non-pii-effects/non-pii.effects';
import { ReactionAcscOffersEffects } from './state/reaction-effects/offer-effects/reaction-acsc-offers.effects';
import { ReactionOffersEffect } from './state/reaction-effects/offer-effects/reaction-offers.effects';
import { ReactionActiveSubscriptionIdEffects } from './state/reaction-effects/plan-info-effects/reaction-active-subscription-id.effects';
import { ReactionActiveSubscriptionMarketTypeEffects } from './state/reaction-effects/plan-info-effects/reaction-active-subscription-market-type.effects';
import { ReactionActiveSubscriptionPlanCodeEffects } from './state/reaction-effects/plan-info-effects/reaction-active-subscription-plan-code.effects';
import { ReactionActiveSubscriptionRevenueStatusEffects } from './state/reaction-effects/plan-info-effects/reaction-active-subscription-revenue-status.effects';
import { ReactionNewSubscriptionActivationFeeEffects } from './state/reaction-effects/plan-info-effects/reaction-new-subscription-activation-fee.effects';
import { ReactionNewSubscriptionPlanCodeEffects } from './state/reaction-effects/plan-info-effects/reaction-new-subscription-plan-code.effects';
import { ReactionNewSubscriptionPriceEffects } from './state/reaction-effects/plan-info-effects/reaction-new-subscription-price.effects';
import { ReactionNewSubscriptionRoyaltyFeeEffects } from './state/reaction-effects/plan-info-effects/reaction-new-subscription-royalty-fee.effects';
import { ReactionNewSubscriptionTaxEffects } from './state/reaction-effects/plan-info-effects/reaction-new-subscription-tax.effects';
import { ReactionNewSubscriptionTermLengthEffects } from './state/reaction-effects/plan-info-effects/reaction-new-subscription-term-length.effects';
import { ReactionPickAPlanSelectedEffects } from './state/reaction-effects/plan-info-effects/reaction-pick-a-plan-selected.effects';
import { ReactionPlanTermEffect } from './state/reaction-effects/plan-info-effects/reaction-plan-term.effect';
import { ReactionPlansOffered } from './state/reaction-effects/plan-info-effects/reaction-plans-offered.effects';
import { ReactionPresentedPlanNamesEffect } from './state/reaction-effects/plan-info-effects/reaction-presented-plan-names.effects';
import { ReactionRenewalPlanSelectedEffects } from './state/reaction-effects/plan-info-effects/reaction-renewal-plan-selected.effects';
import { ReactionRenewalPlansPresentedEffects } from './state/reaction-effects/plan-info-effects/reaction-renewal-plans-presented.effects';
import { ReactionRenewalSubscriptionActivationFeeEffects } from './state/reaction-effects/plan-info-effects/reaction-renewal-subscription-activation-fee.effects';
import { ReactionRenewalSubscriptionPlanCodeEffects } from './state/reaction-effects/plan-info-effects/reaction-renewal-subscription-plan-code.effects';
import { ReactionRenewalSubscriptionPriceEffects } from './state/reaction-effects/plan-info-effects/reaction-renewal-subscription-price.effects';
import { ReactionRenewalSubscriptionRoyaltyFeeEffects } from './state/reaction-effects/plan-info-effects/reaction-renewal-subscription-royalty-fee.effects';
import { ReactionRenewalSubscriptionTaxEffects } from './state/reaction-effects/plan-info-effects/reaction-renewal-subscription-tax.effects';
import { ReactionSelectedOfferEffect } from './state/reaction-effects/plan-info-effects/reaction-selected-offer.effects';
import { PromoCodeEffectsService } from './state/reaction-effects/promo-code-effects/promo-code-effects.service';
import { ReactionAcscQuoteEffects } from './state/reaction-effects/quote-effects/reaction-acsc-quote.effects';
import { ReactionGenericEffects } from './state/reaction-effects/reaction-generic.effects';
import { ReactionProgramCodeEffects } from './state/reaction-effects/reaction-program-code.effects';
import { ReactionUseCaseRoutingEffects } from './state/reaction-effects/reaction-use-case-routing.effects';
import { RrefreshSignalEffects } from './state/reaction-effects/refresh-signal-effects/refresh-signal-effects';
import { RegistrationFromSalesFlowEffects } from './state/reaction-effects/registration-effects/registration-from-sales-flow.effects';
import { RflzLookupEffects } from './state/reaction-effects/rflz-effects/rflz-lookup-effects.service';
import { RollToChoiceEffects } from './state/reaction-effects/rtc-effects/roll-to-choice.effects';
import { ReactionTpbResellerInfo } from './state/reaction-effects/third-party-billing-effects/reaction-tpb-reseller-info.effects';
import { ReactionVerificationOptionsEffects } from './state/reaction-effects/two-factor-auth-effects/verification-options.effects';
import { ReactionUsedCarEligibilityCheckEffects } from './state/reaction-effects/used-car-eligibility-check/reaction-used-car-eligibility-check.effects';
import { VerifyDeviceTabsAuthenticationEffects } from './state/reaction-effects/verify-device-tabs-effects/verify-device-tabs-authentication.effects';
import { TokenForSubscriptionGenerationEffects } from './state/reaction-effects/token-for-subscription/token-for-subscription-effects';

import { Reaction10FootDeviceInfoEffects } from './state/reaction-effects/device-info-effects/reaction-10-foot-device-info.effects';
import { DirectBillingDtokInfoEffects } from './state/reaction-effects/customer-info-effects/direct-billing-dtok-info.effects';
import { EddlIncrementalTransitionEffects } from './state/eddl-incremental-transition-effects/eddl-incremental-transition.effects';
import { ReactionPurchaseEffects } from './state/reaction-effects/reaction-purchase.effects';
import { BuildVersionEnvironmentEffects } from './state/reaction-effects/app-environment/build-version-environment.effects';
import { ReactionDigitalSegmentEffects } from './state/reaction-effects/customer-info-effects/reaction-digital-segment.effects';
import { ImpressionAccountSnapshotEffects } from './state/impression-effects/impression-account-snapshot.effects';
import { BillingStatusEffects } from './state/reaction-effects/customer-info-effects/billing-status.effects';
import { ReactionPrepaidBinEffect } from './state/reaction-effects/account-info/reaction-prepaid-bin.effect';
import { AuthenticationStatusEffects } from './state/reaction-effects/customer-info-effects/authentication-status.effects';
import { ReactionDeviceInfoEffects } from './state/reaction-effects/device-info-effects/reaction-device-info.effects';
import { ReactionUpsellsEffect } from './state/reaction-effects/upsells-effects/reaction-upsells.effects';
import { ReactionCardBinRangesEffects } from './state/reaction-effects/reaction-card-bin-ranges.effects';
import { ReactionCancelPlanTestCellEffects } from './state/reaction-effects/cancel-plan-effects/reaction-cancel-plan-test-cell.effects';
import { ReactionForAccountAddressesStateEffects } from './state/reaction-effects/account-info/reaction-account-addresses-state-effects';
import { ReactionClosedDevicesInfoEffects } from './state/reaction-effects/device-info-effects/reaction-closed-devices-info.effects';

@NgModule({
    imports: [
        EffectsModule.forFeature([
            ImpressionComponentEffects,
            ImpressionPageEffects,
            InteractionEffects,
            InteractionClickEffects,
            InteractionButtonEffects,
            InteractionAccordionStepperEditClicked,
            InteractionAmazonSupportClicked,
            ReactionUseCaseRoutingEffects,
            ErrorEffects,
            ReactionActiveSubscriptionEsnEffects,
            ReactionActiveSubscriptionPlanCodeEffects,
            ReactionActiveSubscriptionServiceIdEffects,
            ReactionActiveSubscriptionIdEffects,
            ReactionActiveSubscriptionVinEffects,
            CustomerTypeEffects,
            BillingStatusEffects,
            PaymentMethodEffects,
            TransactionTypeEffects,
            ReactionTransactionIdEffects,
            ReactionOffersEffect,
            ReactionPresentedPlanNamesEffect,
            ReactionSelectedOfferEffect,
            ReactionPlanTermEffect,
            ReactionNewSubscriptionPlanCodeEffects,
            ReactionNewSubscriptionPriceEffects,
            ReactionNewSubscriptionTermLengthEffects,
            ReactionNewSubscriptionTaxEffects,
            ReactionNewSubscriptionRoyaltyFeeEffects,
            ReactionNewSubscriptionActivationFeeEffects,
            ReactionRenewalSubscriptionPlanCodeEffects,
            ReactionRenewalSubscriptionPriceEffects,
            ReactionRenewalSubscriptionTaxEffects,
            ReactionRenewalSubscriptionRoyaltyFeeEffects,
            ReactionRenewalSubscriptionActivationFeeEffects,
            ReactionRenewalPlansPresentedEffects,
            ReactionRenewalPlanSelectedEffects,
            ReactionChangePlanConversionTypeEffects,
            ReactionCancelPlanReasonEffects,
            ReactionGenericEffects,
            ReactionProgramCodeEffects,
            ErrorEffects,
            ReactionCustomerInfoAuthenticationTypeTypeEffects,
            ReactionCustomerCoreInfoEffects,
            RrefreshSignalEffects,
            ReactionNonPiiActiveSubscriptionStatusEffects,
            RollToChoiceEffects,
            ReactionTpbResellerInfo,
            RflzLookupEffects,
            ReactionDevicePromoCodeEffects,
            Reaction10FootDeviceInfoEffects,
            ReactionUsedCarEligibilityCheckEffects,
            VerifyDeviceTabsAuthenticationEffects,
            NonPiiEffects,
            FlepzLookupEffectsService,
            PromoCodeEffectsService,
            ReactionTransactionIdEffects,
            ReactionSessionIdEffects,
            ReactionSubscriptionIdEffects,
            ReactionActiveSubscriptionMarketTypeEffects,
            ReactionActiveSubscriptionRevenueStatusEffects,
            ReactionPlansOffered,
            AuthenticationTokenEffects,
            ReactionAccountInfoEffects,
            ChatLinkRenderedEffects,
            InteractionEffectChevronClicked,
            ReactionNumberOfAccountsFoundEffects,
            ReactionVerificationOptionsEffects,
            InteractionVerificationOptionSelectedEffects,
            StreamingFlepzLookupEffectsService,
            AppEnvironmentEffects,
            RegistrationFromSalesFlowEffects,
            ReactionStreamingCredentialsEffects,
            ReactionAcscFailureEffects,
            ReactionAcscSuccessEffects,
            ReactionAcscQuoteEffects,
            ReactionChangePlanEffects,
            ReactionAcscOffersEffects,
            AcscEffects,
            ReactionPickAPlanSelectedEffects,
            TokenForSubscriptionGenerationEffects,
            DirectBillingDtokInfoEffects,
            EddlIncrementalTransitionEffects,
            ReactionPurchaseEffects,
            BuildVersionEnvironmentEffects,
            ReactionDigitalSegmentEffects,
            ImpressionAccountSnapshotEffects,
            ReactionPrepaidBinEffect,
            AuthenticationStatusEffects,
            ReactionDeviceInfoEffects,
            ReactionUpsellsEffect,
            ReactionCardBinRangesEffects,
            ReactionCancelPlanTestCellEffects,
            ReactionForAccountAddressesStateEffects,
            ReactionClosedDevicesInfoEffects,
        ]),
    ],
})
export class DomainsDataLayerStateTrackingModule {}
