import { InjectionToken } from '@angular/core';

export interface CardBinRanges {
    binRanges: {
        name: string;
        type: string;
        priority: number;
        regex: string;
    }[];
}

export const BinRangesToken = new InjectionToken<CardBinRanges>('BIN_RANGES', {
    providedIn: 'root',
    factory: () => ({ binRanges: [] }),
});
