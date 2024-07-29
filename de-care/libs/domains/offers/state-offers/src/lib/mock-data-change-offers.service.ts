import { of } from 'rxjs';

// TODO: Remove this as soon as SSO simulation tooling is in place for local dev development
export const mockDataChangeOffersService = {
    getCustomerChangeOffers: () =>
        of([
            {
                planCode: 'Mostly Music - 12mo - wActv',
                packageName: 'SIR_AUD_PKG_MM',
                promoCode: null,
                termLength: 12,
                type: 'SELF_PAY',
                marketType: 'self-pay:standard',
                price: 131.88,
                pricePerMonth: 10.99,
                retailPrice: 10.99,
                msrpPrice: 10.99,
                processingFee: null,
                supportedServices: ['UNIVERSAL_LOGIN', 'ESN'],
                deal: null,
                priceChangeMessagingType: '',
                planEndDate: null,
                fallbackReason: null,
                minimumFollowOnTerm: 0,
                order: 5,
                streaming: false,
                mrdEligible: false,
                fallback: false,
                upgradeOffer: false
            },
            {
                planCode: 'Mostly Music - 1mo - wActv',
                packageName: 'SIR_AUD_PKG_MM',
                promoCode: null,
                termLength: 1,
                type: 'SELF_PAY',
                marketType: 'self-pay:standard',
                price: 10.99,
                pricePerMonth: 10.99,
                retailPrice: 10.99,
                msrpPrice: 10.99,
                processingFee: null,
                supportedServices: ['UNIVERSAL_LOGIN', 'ESN'],
                deal: null,
                priceChangeMessagingType: '',
                planEndDate: null,
                fallbackReason: null,
                minimumFollowOnTerm: 0,
                order: 5,
                streaming: false,
                mrdEligible: false,
                fallback: false,
                upgradeOffer: false
            },
            {
                planCode: 'Select Family Friendly - 1mo - wActv',
                packageName: 'SIR_AUD_FF',
                promoCode: null,
                termLength: 1,
                type: 'SELF_PAY',
                marketType: 'self-pay:standard',
                price: 15.99,
                pricePerMonth: 15.99,
                retailPrice: 15.99,
                msrpPrice: 15.99,
                processingFee: null,
                supportedServices: ['SIR', 'UNIVERSAL_LOGIN', 'ESN'],
                deal: null,
                priceChangeMessagingType: '',
                planEndDate: null,
                fallbackReason: null,
                minimumFollowOnTerm: 0,
                order: 4,
                streaming: false,
                mrdEligible: false,
                fallback: false,
                upgradeOffer: false
            },
            {
                planCode: 'Select Family Friendly - 12mo - wActv',
                packageName: 'SIR_AUD_FF',
                promoCode: null,
                termLength: 12,
                type: 'SELF_PAY',
                marketType: 'self-pay:standard',
                price: 191.88,
                pricePerMonth: 15.99,
                retailPrice: 15.99,
                msrpPrice: 15.99,
                processingFee: null,
                supportedServices: ['SIR', 'UNIVERSAL_LOGIN', 'ESN'],
                deal: null,
                priceChangeMessagingType: '',
                planEndDate: null,
                fallbackReason: null,
                minimumFollowOnTerm: 0,
                order: 4,
                streaming: false,
                mrdEligible: false,
                fallback: false,
                upgradeOffer: false
            },
            {
                planCode: 'Select - 12mo - wActv',
                packageName: 'SIR_AUD_EVT',
                promoCode: null,
                termLength: 12,
                type: 'SELF_PAY',
                marketType: 'self-pay:standard',
                price: 203.88,
                pricePerMonth: 16.99,
                retailPrice: 16.99,
                msrpPrice: 16.99,
                processingFee: null,
                supportedServices: ['SIR', 'UNIVERSAL_LOGIN', 'ESN'],
                deal: null,
                priceChangeMessagingType: '',
                planEndDate: null,
                fallbackReason: null,
                minimumFollowOnTerm: 0,
                order: 3,
                streaming: false,
                mrdEligible: false,
                fallback: false,
                upgradeOffer: false
            },
            {
                planCode: 'Select - 1mo - wActv',
                packageName: 'SIR_AUD_EVT',
                promoCode: null,
                termLength: 1,
                type: 'SELF_PAY',
                marketType: 'self-pay:standard',
                price: 16.99,
                pricePerMonth: 16.99,
                retailPrice: 16.99,
                msrpPrice: 16.99,
                processingFee: null,
                supportedServices: ['SIR', 'UNIVERSAL_LOGIN', 'ESN'],
                deal: null,
                priceChangeMessagingType: '',
                planEndDate: null,
                fallbackReason: null,
                minimumFollowOnTerm: 0,
                order: 3,
                streaming: false,
                mrdEligible: false,
                fallback: false,
                upgradeOffer: false
            },
            {
                planCode: 'News-Sports-Talk - 1mo - wActv',
                packageName: 'SIR_AUD_PKG_NS',
                promoCode: null,
                termLength: 1,
                type: 'SELF_PAY',
                marketType: 'self-pay:standard',
                price: 10.99,
                pricePerMonth: 10.99,
                retailPrice: 10.99,
                msrpPrice: 10.99,
                processingFee: null,
                supportedServices: ['UNIVERSAL_LOGIN', 'ESN'],
                deal: null,
                priceChangeMessagingType: '',
                planEndDate: null,
                fallbackReason: null,
                minimumFollowOnTerm: 0,
                order: 6,
                streaming: false,
                mrdEligible: false,
                fallback: false,
                upgradeOffer: false
            },
            {
                planCode: 'News-Sports-Talk - 12mo - wActv',
                packageName: 'SIR_AUD_PKG_NS',
                promoCode: null,
                termLength: 12,
                type: 'SELF_PAY',
                marketType: 'self-pay:standard',
                price: 131.88,
                pricePerMonth: 10.99,
                retailPrice: 10.99,
                msrpPrice: 10.99,
                processingFee: null,
                supportedServices: ['UNIVERSAL_LOGIN', 'ESN'],
                deal: null,
                priceChangeMessagingType: '',
                planEndDate: null,
                fallbackReason: null,
                minimumFollowOnTerm: 0,
                order: 6,
                streaming: false,
                mrdEligible: false,
                fallback: false,
                upgradeOffer: false
            },
            {
                planCode: 'All Access Family Friendly - 12mo - wActv',
                packageName: 'SIR_AUD_ALLACCESS_FF',
                promoCode: null,
                termLength: 12,
                type: 'SELF_PAY',
                marketType: 'self-pay:standard',
                price: 251.88,
                pricePerMonth: 20.99,
                retailPrice: 20.99,
                msrpPrice: 20.99,
                processingFee: null,
                supportedServices: ['SIR', 'UNIVERSAL_LOGIN', 'ESN'],
                deal: null,
                priceChangeMessagingType: '',
                planEndDate: null,
                fallbackReason: null,
                minimumFollowOnTerm: 0,
                order: 2,
                streaming: false,
                mrdEligible: false,
                fallback: false,
                upgradeOffer: false
            },
            {
                planCode: 'All Access Family Friendly - 1mo - wActv',
                packageName: 'SIR_AUD_ALLACCESS_FF',
                promoCode: null,
                termLength: 1,
                type: 'SELF_PAY',
                marketType: 'self-pay:standard',
                price: 20.99,
                pricePerMonth: 20.99,
                retailPrice: 20.99,
                msrpPrice: 20.99,
                processingFee: null,
                supportedServices: ['SIR', 'UNIVERSAL_LOGIN', 'ESN'],
                deal: null,
                priceChangeMessagingType: '',
                planEndDate: null,
                fallbackReason: null,
                minimumFollowOnTerm: 0,
                order: 2,
                streaming: false,
                mrdEligible: false,
                fallback: false,
                upgradeOffer: false
            }
        ])
};