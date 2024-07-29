import { createAction, props } from '@ngrx/store';
export const behaviorEventReactionForProgramCode = createAction('[Behavior Event] Reaction - Program Code', props<{ programCode: string }>());

export const behaviorEventReactionUseCaseExperienceRequested = createAction(
    '[Behavior Event] Reaction - Use case experience requested',
    props<{ useCase: string; experience: string }>()
);

export const behaviorEventReactionUseCaseExperienceStarted = createAction(
    '[Behavior Event] Reaction - Use case experience started',
    props<{ useCase: string; experience: string }>()
);

export const behaviorEventReactionFeatureTransactionStarted = createAction(
    '[Behavior Event] Reaction - Feature transaction started',
    props<{ flowName: string; flowVariation?: string }>()
);

export const behaviorEventReactionForPackageNamesPresented = createAction('[Behavior Event] Reaction - PackageNames presented', props<{ packages: string[] }>());

export const behaviorEventReactionForSelectedPlan = createAction(
    '[Behavior Event] Reaction - Change subscription selected plan',
    props<{ audioSelected: { planCode: string; price: number }; dataSelected?: { planCode: string; price: number }[] }>()
);

export const behaviorEventReactionForPlanTerm = createAction('[Behavior Event] Reaction - Plan Term', props<{ planTerm: string }>());
export const behaviorEventReactionForPaymentMethod = createAction('[Behavior Event] Reaction - Payment Method', props<{ paymentMethod: string }>());

export const genericBehaviorEventReaction = createAction(
    '[Behavior Event] Reaction - Custom',
    props<{ dataLayerKeyToUpdate: string; dataLayerPayloadToUpdate: any; eventAction: string; eventData: any }>()
);

export const behaviorEventReactionForTransactionId = createAction('[Behavior Event] Reaction - Transaction Id', props<{ transactionId: string }>());
export const behaviorEventReactionForTransactionType = createAction('[Behavior Event] Reaction - Transaction Type', props<{ transactionType: string }>());
export const behaviorEventReactionForCustomerType = createAction('[Behavior Event] Reaction - Customer Type', props<{ customerType: string }>());
export const behaviorEventReactionForBillingStatus = createAction('[Behavior Event] Reaction - Billing Status', props<{ billingStatus: string }>());
export const behaviorEventReactionForSessionId = createAction('[Behavior Event] Reaction - Session Id', props<{ sessionId: string }>());

export const behaviorEventReactionActiveSubscriptionPlanCodes = createAction(
    '[Behavior Event] Reaction - Active Subscription Plans Codes',
    props<{ plans: { code: string }[] }>()
);
export const behaviorEventReactionActiveSubscriptionRadioId = createAction('[Behavior Event] Reaction - Active Subscription RadioId', props<{ radioId: string }>());
export const behaviorEventReactionActiveSubscriptionServiceId = createAction('[Behavior Event] Reaction - Active Subscription Service Id', props<{ id: string }>());
export const behaviorEventReactionActiveSubscriptionId = createAction('[Behavior Event] Reaction - Active Subscription Id', props<{ id: string }>());

export const behaviorEventReactionQuoteNewSubscriptionPlanCode = createAction(
    '[Behavior Event] Reaction - Quote New Subscription Plan Code',
    props<{ planCodes: string[] }>()
);
export const behaviorEventReactionQuoteNewSubscriptionPrice = createAction('[Behavior Event] Reaction - Quote New Subscription Plan Price', props<{ price: number }>());
export const behaviorEventReactionQuoteNewSubscriptionTermLength = createAction(
    '[Behavior Event] Reaction - Quote New Subscription Term Length',
    props<{ termLength: number }>()
);
export const behaviorEventReactionQuoteNewSubscriptionTax = createAction('[Behavior Event] Reaction - Quote New Subscription Plan Tax', props<{ tax: number }>());
export const behaviorEventReactionQuoteNewSubscriptionRoyaltyFee = createAction(
    '[Behavior Event] Reaction - Quote New Subscription Plan Royalty Fee',
    props<{ fee: number }>()
);
export const behaviorEventReactionQuoteNewSubscriptionActivationFee = createAction(
    '[Behavior Event] Reaction - Quote New Subscription Plan Activation Fee',
    props<{ fee: number }>()
);
export const behaviorEventReactionQuoteRenewalSubscriptionPlanCode = createAction(
    '[Behavior Event] Reaction - Quote Renewal Subscription Plan Code',
    props<{ planCodes: string[] }>()
);
export const behaviorEventReactionQuoteRenewalSubscriptionPrice = createAction(
    '[Behavior Event] Reaction - Quote Renewal Subscription Plan Price',
    props<{ price: number }>()
);
export const behaviorEventReactionQuoteRenewalSubscriptionTax = createAction('[Behavior Event] Reaction - Quote Renewal Subscription Plan Tax', props<{ tax: number }>());
export const behaviorEventReactionQuoteRenewalSubscriptionRoyaltyFee = createAction(
    '[Behavior Event] Reaction - Quote Renewal Subscription Plan Royalty Fee',
    props<{ fee: number }>()
);
export const behaviorEventReactionQuoteRenewalSubscriptionActivationFee = createAction(
    '[Behavior Event] Reaction - Quote Renewal Subscription Plan Activation Fee',
    props<{ fee: number }>()
);
export const behaviorEventReactionChangePlanConversionType = createAction(
    '[Behavior Event] Reaction - Change Plan Submission Conversion Type',
    props<{ conversionType: 'upgrade' | 'downgrade' | null }>()
);

export const behaviorEventReactionForOffers = createAction(
    '[Behavior Event] Reaction - Offers Loaded',
    props<{ audioPackages: { planCode: string; price: number; packageName: string }[]; dataPackages: { planCode: string; price: number; packageName: string }[] }>()
);
export const behaviorEventReactionForUpsells = createAction('[Behavior Event] Reaction - Upsells Loaded', props<{ upsellOffers: unknown[] }>());
export const behaviorEventReactionForPreselectedPlan = createAction(
    '[Behavior Event] Reaction - Offers Preselected Plan',
    props<{ audioPackage: { planCode: string; price: number; packageName: string } }>()
);

export const behaviorEventReactionRenewalPlansPresented = createAction(
    '[Behavior Event] Reaction - Renewal Plans Presented',
    props<{ presented: { planCode: string; price: number }[] }>()
);

export const behaviorEventReactionRenewalPlanSelected = createAction(
    '[Behavior Event] Reaction - Renewal Plan Selected',
    props<{ selected: { planCode: string; price: number } }>()
);

export const behaviorEventReactionPickAPlanSelected = createAction(
    '[Behavior Event] Reaction - Pick a plan Selected',
    props<{ selected: { planCode: string; price: number } }>()
);

export const behaviorEventReactionForPlansOffered = createAction(
    '[Behavior Event] Reaction - Plans Offered',
    props<{ plansOffered: { planCode: string; price: number }[] }>()
);

export const behaviorEventReactionCancelPlanReason = createAction('[Behavior Event] Reaction - Cancel Plan Reason', props<{ reason: string }>());

export const behaviorEventReactionCustomerCoreInfo = createAction(
    '[Behavior Event] Reaction - Customer Core Info  ',
    props<{ firstName: string; lastName: string; email: string; phone: string; accountNumber: string }>()
);
export const behaviorEventReactionCustomerInfoAuthenticationType = createAction(
    '[Behavior Event] Reaction - CustomerInfo Authentication Type',
    props<{ authenticationType: string }>()
);

export const behaviorEventReactionDeviceInfo = createAction(
    '[Behavior Event] Reaction - DeviceInfo',
    props<{ esn?: string; vehicleInfo?: { year?: string; make?: string; model?: string; vin?: string } }>()
);

export const behaviorEventReactionClosedDevicesInfo = createAction(
    '[Behavior Event] Reaction - ClosedDevicesInfo',
    props<{ closedDevices: { esnLast4Digits: string; dateClosed: string }[] }>()
);
export const behaviorEventReactionDeviceInfoEsn = createAction('[Behavior Event] Reaction - DeviceInfo ESN', props<{ esn: string }>());

export const behaviorEventReactionRefreshSignalBySignal = createAction('[Behavior Event] Reaction - Refresh signal by signal');
export const behaviorEventReactionRefreshSignalByText = createAction('[Behavior Event] Reaction - Refresh signal by text');

export const behaviorEventReactionNonPiiActiveSubscriptionId = createAction('[Behavior Event] Reaction - Non Pii Active Subscription Id', props<{ id: string }>());
export const behaviorEventReactionNonPiiActiveSubscriptionStatus = createAction('[Behavior Event] Reaction - Non Pii Active Subscription Status', props<{ status: string }>());
export const behaviorEventReactionRadioPromoCode = createAction('[Behavior Event] Reaction - Radio promo code', props<{ code: string }>());

export const behaviorEventReactionRTCProactiveOrganicAccountLookupCompleted = createAction(
    '[Behavior Event] Reaction - RTC Proactive Organic Account Lookup Completed',
    props<{ componentName }>()
);
export const behaviorEventReactionThirdPartyBillingResellerInfo = createAction(
    '[Behavior Event] Reaction - Third Party Billing Reseller Code & PartnerName',
    props<{ resellerCode: string; partnerName: string }>()
);

export const behaviorEventReactionUsedCarEligibilityCheckDevicePromoCode = createAction(
    '[Behavior Event] Reaction - Used car eligibility check device promo code',
    props<{ devicePromoCode: string }>()
);

export const behaviorEventReactionUsedCarEligibilityCheckRadioId = createAction(
    '[Behavior Event] Reaction - Used car eligibility check radioId',
    props<{ radioId: string }>()
);

export const behaviorEventReactionUsedCarEligibilityCheckErrorCode = createAction(
    '[Behavior Event] Reaction - Used car eligibility check error code',
    props<{ errorCode: string }>()
);

export const behaviorEventReactionRflzFormClientSideValidationErrors = createAction(
    '[Behavior Event] Reaction - RFLZ form client side validation errors',
    props<{ errors: string[] }>()
);

export const behaviorEventReactionRflzLookupSuccess = createAction('[Behavior Event] Reaction - RFLZ lookup success', props<{ componentKey: string }>());
export const behaviorEventReactionRflzLookupFailure = createAction('[Behavior Event] Reaction - RFLZ lookup failure', props<{ componentKey: string }>());
export const behaviorEventReactionLookupByRadioIdSuccess = createAction('[Behavior Event] Lookup By Radio Id Success');
export const behaviorEventReactionLookupByRadioIdFailure = createAction('[Behavior Event] Lookup By Radio Id Failure');
export const behaviorEventReactionLookupByAccountNumberSuccess = createAction('[Behavior Event] Lookup By Account Number Success');
export const behaviorEventReactionLookupByAccountNumberAndRadioIdSuccess = createAction('[Behavior Event] Lookup By Account Number And Radio Success');
export const behaviorEventReactionLookupByLoginSuccess = createAction('[Behavior Event] Lookup By Login Success');
export const behaviorEventReactionLookupByLoginFailure = createAction('[Behavior Event] Lookup By Login Failure');
export const behaviorEventReactionLookupByAccountNumberFailure = createAction('[Behavior Event] Lookup By Account Number Failure');
export const behaviorEventReactionLookupByAccountNumberAndRadioIdFailure = createAction('[Behavior Event] Lookup By Account Number And Radio Failure');
export const behaviorEventReactionLookupByFlepzSuccess = createAction('[Behavior Event] Lookup By Flepz Success');
export const behaviorEventReactionLookupByFlepzFailure = createAction('[Behavior Event] Lookup By Flepz Failure');
export const behaviorEventReactionLookupByVinSuccess = createAction('[Behavior Event] Lookup By Vin Success', props<{ vin: string }>());
export const behaviorEventReactionLookupByVinFailure = createAction('[Behavior Event] Lookup By Vin Failure');
export const behaviorEventReactionLookupByLicensePlateSuccess = createAction('[Behavior Event] Lookup By Licence Plate Success');
export const behaviorEventReactionLookupByLicensePlateFailure = createAction('[Behavior Event] Lookup By Licence Plate Failure');
export const behaviorEventReactionLookupAuthenticationFailure = createAction('[Behavior Event] Lookup Authentication Failure');
export const behaviorEventReactionNonPiiDevicePromoCode = createAction('[Behavior Event] Non PII active device promocode', props<{ promoCode: string }>());

export const behaviorEventReactionAuthenticationSuccess = createAction('[Behavior Event] Authentication Success');
export const behaviorEventReactionAuthenticationByRadioVerifySuccess = createAction('[Behavior Event] Authentication By Radio Verify Success');
export const behaviorEventReactionAuthenticationByRadioVerifyFailure = createAction('[Behavior Event] Authentication By Radio Verify Failure');
export const behaviorEventReactionAuthenticationByFlepzSuccess = createAction('[Behavior Event] Authentication By Flepz Success');
export const behaviorEventReactionAuthenticationByFlepzFailure = createAction('[Behavior Event] Authentication By Flepz Failure');
export const behaviorEventReactionAuthenticationByAccountNumberAndRadioIdSuccess = createAction('[Behavior Event] Authentication By Account Number and Radio Id Success');
export const behaviorEventReactionAuthenticationByLoginSuccess = createAction('[Behavior Event] Authentication By Login Success');

export const behaviorEventReactionNonPiiMarketingId = createAction(
    '[Behavior Event] Reaction - Non Pii Marketing Id',
    props<{ marketingId: string; marketingAccountId: string }>()
);
export const behaviorEventReactionNonPiiClosedDeviceSubscriptionId = createAction(
    '[Behavior Event] Reaction - Non Pii Closed Device Subscription Id',
    props<{ id: string }>()
);

export const behaviorEventReactionFlepzFormClientSideValidationErrors = createAction(
    '[Behavior Event] Reaction - FLEPZ form client side validation errors',
    props<{ errors: string[] }>()
);

export const behaviorEventReactionAccountInfoFormClientSideValidationErrors = createAction(
    '[Behavior Event] Reaction - Account info form client side validation errors',
    props<{ errors: string[] }>()
);

export const behaviorEventReactionPromoCodeValidationSuccess = createAction('[Behavior Event] Reaction - Promo Code Validation Success', props<{ componentName: string }>());
export const behaviorEventReactionPromoCodeValidationFailure = createAction('[Behavior Event] Reaction - Promo Code Validation Failure', props<{ componentName: string }>());

export const behaviorEventReactionNewSubscriptionId = createAction('[Behavior Event] Reaction - New Subscription Id', props<{ id: string }>());
export const behaviorEventReactionFirstOfferDevicePromoCode = createAction('[Behavior Event] Reaction - New Subscription Id', props<{ devicePromoCode: string }>());

export const behaviorEventReactionOffersMarketType = createAction('[Behavior Event] Reaction - Non Pii Active Subscription Market Type', props<{ marketType: string }>());

export const behaviorEventReactionQuoteRevenueStatus = createAction('[Behavior Event] Reaction - Quote Revenue Status', props<{ revenueStatus: string }>());

export const behaviorEventReactionAuthenticationToken = createAction('[Behavior Event] Reaction - Authentication Token', props<{ authenticationToken: string }>());

export const behaviorEventReactionAccountFromAcscTokenSuccess = createAction('[Behavior Event] Reaction - Account From Acsc Token Success');
export const behaviorEventReactionAccountFromAcscTokenFailure = createAction('[Behavior Event] Reaction - Account From Acsc Token Failure', props<{ errorMessage: string }>());
export const behaviorEventReactionNumberOfAccountsFound = createAction('[Behavior Event] Reaction - Number of Accouns Found', props<{ accountsFound: number }>());
export const behaviorEventReactionVerificationMethods = createAction('[Behavior Event] Reaction - Account Verification Methods', props<{ verificationOptions: string[] }>());
export const behaviorEventReactionAccountAcscSuccess = createAction('[Behavior Event] Reaction - Account Acsc Success');
export const behaviorEventReactionAccountAcscFailure = createAction('[Behavior Event] Reaction - Account Acsc Failure', props<{ errorMessage: string }>());

export const behaviorEventReactionForSuccessfulRegistration = createAction('[Behavior Event] Reaction - Successful Registration');
export const behaviorEventReactionForFailedRegistration = createAction('[Behavior Event] Reaction - Failed Registration');
export const behaviorEventReactionForEligibleForRegistration = createAction('[Behavior Event] Reaction - Eligible for Registration');
export const behaviorEventReactionPlanNamesForRegistration = createAction('[Behavior Event] Reaction - Plan Names for Registration', props<{ planNames: string }>());

export const behaviorEventReactionStreamingCredentialsUpdated = createAction('[Behavior Event] Reaction - Streaming credentials updated');

export const behaviorEventReactionAcscQuoteFailure = createAction('[Behavior Event] Reaction - Acsc Quote Failure', props<{ errorMessage: string }>());
export const behaviorEventReactionAcscOffersFailure = createAction('[Behavior Event] Reaction - Acsc Offers Failure', props<{ errorMessage: string }>());
export const behaviorEventReactionServiceContinuitySuccess = createAction('[Behavior Event] Reaction - Service Continuity Success');
export const behaviorEventReactionServiceContinuityFailure = createAction('[Behavior Event] Reaction - Service Continuity Failure', props<{ errorMessage: string }>());
export const behaviorEventReactionChangeSubscriptionFailure = createAction('[Behavior Event] Reaction - Change Subscription Failure', props<{ errorMessage: string }>());
export const behaviorEventReactionAccountConsolidationSuccess = createAction('[Behavior Event] Reaction - Account Consolidation Success');
export const behaviorEventReactionAccountConsolidationFailure = createAction('[Behavior Event] Reaction - Account Consolidation Failure', props<{ errorMessage: string }>());
export const behaviorEventReactionSwapSuccess = createAction('[Behavior Event] Reaction - Swap Success');
export const behaviorEventReactionSwapFailure = createAction('[Behavior Event] Reaction - Swap Failure', props<{ errorMessage: string }>());

export const behaviorEventReactionAcscTrialPackageName = createAction('[Behavior Event] Reaction - Acsc Trial Package Name', props<{ trialPackageName: string }>());
export const behaviorEventReactionAcscNumberOfScEligibleDevices = createAction(
    '[Behavior Event] Reaction - Acsc Number of SC Eligible Devices',
    props<{ numberScEligibleDevices: number }>()
);
export const behaviorEventReactionSwapRadioIdToMarketingId = createAction('[Behavior Event] Reaction - Swap radioId to marketingId', props<{ marketingId: string }>());

export const behaviorEventReactionDevicePromoCode = createAction('[Behavior Event] Reaction - Device Promo Code', props<{ devicePromoCode: string }>());

export const behaviorEventReactionForOffersEligibility = createAction(
    '[Behavior Event] Reaction - Offers eligibility',
    props<{ offers: { planCode: string; eligible: boolean }[] }>()
);

export const behaviorEventReactionRflzDeviceInfoVin = createAction('[Behavior Event] Reaction - RFLZ DeviceInfo VIN', props<{ vin: string }>());

export const behaviorEventReactionTokenForSubscriptionGenerationSuccess = createAction('[Behavior Event] Reaction - Token for subscription generated Success');
export const behaviorEventReactionTokenForSubscriptionGenerationFailure = createAction(
    '[Behavior Event] Reaction - Token for subscription generation failure',
    props<{ failure: string }>()
);
export const behaviorEventReaction10FootDeviceInfo = createAction('[Behavior Event] Reaction - 10 Foot Device Info', props<{ deviceInfo: string }>());
export const behaviorEventReactionFordtok = createAction('[Behavior Event] Reaction - Direct Billing dtok', props<{ dtok: string }>());
export const behaviorEventReactionForDigitalSegment = createAction('[Behavior Event] Reaction - Digital Segment', props<{ digitalSegment: string }>());
export const behaviorEventReactionForPrepaidBin = createAction('[Behavior Event] Reaction - Prepaid BIN', props<{ prePaidBin: boolean }>());
export const behaviorEventReactionAuthenticationStatusAuthenticated = createAction('[Behavior Event] Reaction - Customer authenticated');
export const behaviorEventReactionAuthenticationStatusIdentified = createAction('[Behavior Event] Reaction - Customer identified');
export const behaviorEventReactionAuthenticationStatusUnidentified = createAction('[Behavior Event] Reaction - Customer unidentified');
export const behaviorEventReactionCancelOnlineEligibilityInfo = createAction(
    '[Behavior Event] Reaction - Cancel Online Eligibility Info',
    props<{ cancelOnlineEligibility: { cancelOnlineEligible: boolean; cancelRuleTriggered: string; cancelRuleUsed: string } }>()
);

export const behaviorEventReactionPresentmentTestCellInfo = createAction('[Behavior Event] Reaction - Presentment Test Cell', props<{ presentmentTestCell: string[] }>());

export const behaviorEventReactionForAccountAddressesState = createAction(
    '[Behavior Event Reaction] - Reaction - Account addresses state',
    props<{ serviceAddressState: string; billingAddressState: string }>()
);
