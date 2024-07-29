import { PrepaidRedeemRequest } from '@de-care/domains/customer/state-prepaid-redeem';
import { createAction, props } from '@ngrx/store';

export const incorrectVehicleIndicated = createAction('[Trial activation RTP] Create account: not your car clicked');
export const addPrepaidRedeem = createAction('[Trial activation RTP] Create account: add prepaid redeem', props<{ request: PrepaidRedeemRequest }>());
export const removePrepaidRedeem = createAction('[Trial activation RTP] Create account: remove prepaid redeem');
export const setPrepaidRedeemInfo = createAction('[Trial activation RTP] Create account: set prepaid redeem info', props<{ amount: number }>());
export const removePrepaidRedeemInfo = createAction('[Trial activation RTP] Create account: remove prepaid redeem info');

export const addPrepaidRedeemFailed = createAction('[Trial activation RTP] Create account: add prepaid redeem failed');
export const removePrepaidRedeemFailed = createAction('[Trial activation RTP] Create account: remove prepaid redeem failed');
export const setAccountFormSubmitted = createAction('[Trial activation RTP] Create account: account form submitted', props<{ submitted: boolean }>());
export const provinceManuallyChangedRenewalRequestFailed = createAction('[Trial activation RTP] Create account: province manually changed renewal request failed');
export const navigateToNouvRtcPlanGrid = createAction('[Trial activation RTP] Navigate to NOUV RTC plan grid');
export const setDisplayRtcGrid = createAction('[Trial activation RTP] Activate display RTC Grid', props<{ displayed: boolean }>());
export const setAddressEditionRequired = createAction('[Trial activation RTP] Set Address Edition Required by customer');
export const resetAddressEditionRequired = createAction('[Trial activation RTP] Reset Address Edition Required by customer');
export const setSelectedPackageInfoForDataLayer = createAction('[Trial activation RTP] Set Selected Package Inofrmation for Analytics Data Layer');
export const callDeviceInfoService = createAction('[Trial activation RTP] Call device info service', props<{ radioId: string }>());
export const setPickAPlanSelectedPackageInfoForDataLayer = createAction('[Trial activation RTP] Set Pick A Plan Selected Package Information for Analytics Data Layer');
