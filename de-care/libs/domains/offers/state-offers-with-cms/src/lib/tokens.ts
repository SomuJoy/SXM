import { InjectionToken } from '@angular/core';

/**
 * Token to override using CMS offer content even if feature flag is enabled.
 */
export const USE_LEGACY_OFFER_CONTENT = new InjectionToken<boolean>('UseLegacyOfferContent');
