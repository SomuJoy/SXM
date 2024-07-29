import { OfferRenewalRequestModel } from '@de-care/data-services';

export type HandleRTCStreamingParams = Omit<OfferRenewalRequestModel, 'streaming'>;
