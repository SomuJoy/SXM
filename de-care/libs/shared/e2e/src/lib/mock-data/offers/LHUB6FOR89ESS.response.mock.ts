export const mockResponse = {
    status: 'SUCCESS',
    httpStatusCode: 200,
    httpStatus: 'OK',
    data: {
        offers: [
            {
                planCode: 'Promo - Essential Streaming - 6mo - 89.00 - wETF (6mo89) - GGLEHUB1',
                packageName: 'SIR_IP_SA_ESNTL',
                promoCode: 'SXIRPROMOS',
                termLength: 6,
                type: 'RTP_OFFER',
                marketType: 'self-pay:promo',
                price: 89.0,
                pricePerMonth: 14.83,
                retailPrice: 8.0,
                msrpPrice: 8.0,
                processingFee: null,
                supportedServices: ['SIR', 'UNIVERSAL_LOGIN'],
                deal: { type: 'GGLE_HUB', etfAmount: 89.0, etfTerm: 6, partnerBundle: false },
                priceChangeMessagingType: '',
                planEndDate: null,
                fallbackReason: null,
                minimumFollowOnTerm: 1,
                order: null,
                streaming: false,
                mrdEligible: false,
                fallback: false,
                upgradeOffer: false
            }
        ]
    }
};
