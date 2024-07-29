import { BillingAddress } from '../../data-models/billing-address';
import { PaymentInfo } from '../../data-models/payment-info';
import { OemFlowRouteData } from '../../oem-flow.resolver';

export type OemFlowStepSubmission = { billingAddress: BillingAddress } | { paymentInfo: PaymentInfo } | { oemFlowRouteData: OemFlowRouteData };
