import { timer } from 'rxjs';

export interface IClientSDK {
    device: {
        grant: () => Promise<unknown>;
    };
    user?: {
        startSessionAnonymous: () => Promise<void>;
    };
    offers?: {
        retrieveOffers: () => Promise<EligibilityOffer[]>;
    };
    setDeviceGrant?: (grant: JSON | null) => void;
    setAuthToken?: (token: AuthToken | null) => void;
}

interface AuthToken {
    accessToken: string;
    sessionType: string;
    accessTokenExpiresAt: string;
    refreshTokenExpiresAt: string;
}

type Currency = 'USD' | 'CAD';
type BaseOfferTerm = 'Monthly' | 'Annual' | 'NonRecurring';
type BillingPlatform = 'AmazonAppStore' | 'AppleAppStore' | 'Direct' | 'GooglePlayStore' | 'RokuPay';
type OfferPhaseType = 'AutoRenewing' | 'Free' | 'Introductory';
type FiniteDurationTimeUnit = 'Days' | 'Weeks' | 'Months' | 'Years';
type PhaseDuration = { finite: { length: number; timeUnit: FiniteDurationTimeUnit } } | { infinite: Record<string, never> };

interface EligibilityOffer {
    id: string;
    name: string;
    products: [
        {
            id: string;
            name: string;
        }
    ];
    currency: Currency;
    baseTerm: BaseOfferTerm;
    billingPlatform: BillingPlatform;
    basePrice: number;
    phases: [
        {
            type: OfferPhaseType;
            duration: PhaseDuration;
            billingPeriod: {
                length: number;
                timeUnit: FiniteDurationTimeUnit;
            };
            price: {
                amount: number;
                calculatedAs: {
                    basePrice: number;
                    fixedDiscount: number;
                    percentageDiscount: number;
                };
            };
        }
    ];
}

export class ClientSDK implements IClientSDK {
    private _deviceGrant: string = null;
    private _authToken: AuthToken = null;

    constructor(private readonly _edgeGateway: string) {}

    device = {
        grant: async () => {
            const payload = {
                deviceAttributes: {
                    apple: {
                        sdkVersion: 'string',
                        osVersion: 'string',
                        make: 'string',
                        model: 'string',
                        deviceToken: 'string',
                    },
                },
            };

            try {
                const response = await fetch(`${this._edgeGateway}/devices`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-sxm-platform': 'browser',
                        'x-sxm-tenant': 'sxm',
                    },
                    body: JSON.stringify(payload),
                });
                this.setDeviceGrant(await response.json());
            } catch (error) {
                throw new Error(error);
            }
        },
    };
    user = {
        startSessionAnonymous: async () => {
            try {
                await timer(1000).toPromise(); // Temporary delay until core-eng-services can resolve eventual consistency issue.
                const response = await fetch(`${this._edgeGateway}/session/v1/sessions/anonymous`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${this._deviceGrant}`,
                    },
                });
                this.setAuthToken(await response.json());
            } catch (error) {
                throw new Error(error);
            }
        },
    };
    offers = {
        retrieveOffers: async () => {
            try {
                const response = await fetch(`${this._edgeGateway}/offers`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${this._authToken.accessToken}`,
                        'X-Source': 'web',
                    },
                });
                return (await response.json())?.['offers'] as EligibilityOffer[];
            } catch (error) {
                throw new Error(error);
            }
        },
    };
    setDeviceGrant(deviceGrant: JSON | null) {
        this._deviceGrant = deviceGrant?.['grant'];
    }
    setAuthToken(token: AuthToken | null) {
        this._authToken = token;
    }
}
