export const mockSatelliteAccount = {
    firstName: 'RICK',
    email: 'KQXBBI.DDDW@SIRIUSXM.COM',
    accountProfile: { accountRegistered: false },
    subscriptions: [{ radioService: { last4DigitsOfRadioId: '7821', vehicleInfo: { year: 2017, make: 'Nissan', model: 'Rogue' } } }],
    closedDevices: [],
    isNewAccount: true
};

export const mockStreamingAccount = {
    firstName: 'Jason',
    email: 'jason.peg@gmail.com',
    accountProfile: { accountRegistered: false },
    useEmailAsUsername: true,
    hasUserCredentials: true,
    subscriptions: [],
    closedDevices: []
};

export const mockSatelliteRadioOffer = {
    planCode: 'Promo - Select - 6mo - 29.94 - (4.99FOR6) - 1X',
    packageName: 'SIR_AUD_EVT',
    promoCode: 'WBGA',
    termLength: 6,
    type: 'PROMO',
    marketType: 'self-pay:promo',
    price: 29.94,
    pricePerMonth: 4.99,
    retailPrice: 15.99,
    supportedServices: ['UNIVERSAL_LOGIN', 'ESN'],
    quote: {
        currentQuote: null,
        futureQuote: {
            totalTaxAmount: '4.79',
            totalFeesAmount: '6.41',
            totalTaxesAndFeesAmount: '11.20',
            totalAmount: '41.14',
            discountAmount: '0.00',
            pricePerMonth: '4.99',
            currentBalance: '',
            previousBalance: '',
            fees: [{ description: 'U.S. Music Royalty Fee', amount: '6.41' }],
            taxes: [
                { description: 'State Tax', amount: '2.71' },
                { description: 'City Tax', amount: '2.08' }
            ],
            details: [
                {
                    planCode: 'Promo - Select - 6mo - 29.94 - (4.99FOR6) - 1X',
                    packageName: 'SIR_AUD_EVT',
                    termLength: 6,
                    priceAmount: '29.94',
                    taxAmount: '4.79',
                    feeAmount: '6.41',
                    totalTaxesAndFeesAmount: '11.20',
                    taxes: [
                        { description: 'State Tax', amount: '2.71' },
                        { description: 'City Tax', amount: '2.08' }
                    ],
                    fees: [{ description: 'U.S. Music Royalty Fee', amount: '6.41' }],
                    startDate: '2020-05-24',
                    endDate: '2020-11-24',
                    isMrdEligible: false,
                    balanceType: null
                }
            ],
            isUpgraded: null,
            isProrated: false
        },
        renewalQuote: {
            totalTaxAmount: '2.55',
            totalFeesAmount: '3.42',
            totalTaxesAndFeesAmount: '5.97',
            totalAmount: '21.96',
            discountAmount: '0.00',
            pricePerMonth: '15.99',
            currentBalance: '',
            previousBalance: '',
            fees: [{ description: 'U.S. Music Royalty Fee', amount: '3.42' }],
            taxes: [
                { description: 'State Tax', amount: '1.44' },
                { description: 'City Tax', amount: '1.11' }
            ],
            details: [
                {
                    planCode: 'Select - 1mo - wActv',
                    packageName: 'SIR_AUD_EVT',
                    termLength: 1,
                    priceAmount: '15.99',
                    taxAmount: '2.55',
                    feeAmount: '3.42',
                    totalTaxesAndFeesAmount: '5.97',
                    taxes: [
                        { description: 'State Tax', amount: '1.44' },
                        { description: 'City Tax', amount: '1.11' }
                    ],
                    fees: [{ description: 'U.S. Music Royalty Fee', amount: '3.42' }],
                    startDate: '2020-11-24',
                    endDate: '2020-12-24',
                    isMrdEligible: false,
                    balanceType: null
                }
            ],
            isUpgraded: null,
            isProrated: false
        }
    }
};

export const mockStreamingOffer = {
    planCode: 'Essential Streaming - Monthly',
    packageName: 'SIR_IP_SA_ESNTL',
    promoCode: 'STANDARD_RETAIL',
    termLength: 1,
    type: 'SELF_PAY',
    marketType: 'self-pay:standard',
    price: 8,
    pricePerMonth: 8,
    retailPrice: 8,
    msrpPrice: 8,
    processingFee: null,
    supportedServices: ['SIR', 'UNIVERSAL_LOGIN'],
    deal: null,
    priceChangeMessagingType: '',
    fallback: false,
    streaming: true,
    mrdEligible: false,
    quote: {
        currentQuote: {
            totalTaxAmount: '0.00',
            totalFeesAmount: '0.70',
            totalTaxesAndFeesAmount: '0.70',
            totalAmount: '8.70',
            discountAmount: '0.00',
            pricePerMonth: '8.00',
            currentBalance: '8.70',
            previousBalance: '0.00',
            fees: [
                {
                    description: 'U.S. Music Royalty Fee',
                    amount: '0.70'
                }
            ],
            taxes: [],
            details: [
                {
                    planCode: 'Essential Streaming - Monthly',
                    packageName: 'SIR_IP_SA_ESNTL',
                    termLength: 1,
                    priceAmount: '8.00',
                    taxAmount: '0.00',
                    feeAmount: '0.70',
                    totalTaxesAndFeesAmount: '0.70',
                    taxes: [],
                    fees: [
                        {
                            description: 'U.S. Music Royalty Fee',
                            amount: '0.70'
                        }
                    ],
                    startDate: '2019-12-06',
                    endDate: '2020-01-06',
                    isMrdEligible: false,
                    balanceType: null
                }
            ],
            isUpgraded: false,
            isProrated: false
        },
        renewalQuote: {
            totalTaxAmount: '0.00',
            totalFeesAmount: '0.70',
            totalTaxesAndFeesAmount: '0.70',
            totalAmount: '8.70',
            discountAmount: '0.00',
            pricePerMonth: '8.00',
            currentBalance: '',
            previousBalance: '',
            fees: [
                {
                    description: 'U.S. Music Royalty Fee',
                    amount: '0.70'
                }
            ],
            taxes: [],
            details: [
                {
                    planCode: 'Essential Streaming - Monthly',
                    packageName: 'SIR_IP_SA_ESNTL',
                    termLength: 1,
                    priceAmount: '8.00',
                    taxAmount: '0.00',
                    feeAmount: '0.70',
                    totalTaxesAndFeesAmount: '0.70',
                    taxes: [],
                    fees: [
                        {
                            description: 'U.S. Music Royalty Fee',
                            amount: '0.70'
                        }
                    ],
                    startDate: '2020-01-06',
                    endDate: '2020-02-06',
                    isMrdEligible: false,
                    balanceType: null
                }
            ],
            isUpgraded: null,
            isProrated: false
        }
    }
};
