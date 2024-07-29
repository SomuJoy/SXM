import { createAction } from '@ngrx/store';

export { setSelectedPlanCode, setSelectedProvinceCode } from '@de-care/de-care-use-cases/checkout/state-common';
export const skipUpdateOfferOnProvinceChange = createAction('[Checkout Streaming Roll to Drop] Skip update offer on province change');
export const updateOfferOnProvinceChange = createAction('[Checkout Streaming Roll to Drop] update offer on province change');
