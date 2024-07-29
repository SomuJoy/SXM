interface OffersPayload {
    request: {
        execute: {
            mboxes: { index: number; name: string }[];
        };
    };
}

interface OffersResponse {
    execute: {
        mboxes: { index: number; name: string; options?: { content: any }[] }[];
    };
}

interface ApplyOffersPayload {
    response: OffersResponse;
}

export interface AdobeTarget {
    getOffers: (payload: OffersPayload) => Promise<OffersResponse>;
    applyOffers: (payload: ApplyOffersPayload) => void;
}
