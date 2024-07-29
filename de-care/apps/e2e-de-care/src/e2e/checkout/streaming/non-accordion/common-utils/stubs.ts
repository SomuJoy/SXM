import {
    stubAccountNonPiiStreamingNonAccordionOrganicSuccess,
    stubAccountNonPiiStreamingNonAccordionOrganicUpsellTerm,
} from '../../../../../support/stubs/de-microservices/account';
import {
    stubPurchaseNewAccountStreamingNonAccordionOrganicSuccess,
    stubPurchaseNewAccountStreamingNonAccordionOrganicUpsellTerm,
} from '../../../../../support/stubs/de-microservices/purchase';
import { stubUtilitySecurityQuestionsSuccess } from '../../../../../support/stubs/de-microservices/utility';

export const stubTransactionSuccess = () => {
    stubPurchaseNewAccountStreamingNonAccordionOrganicSuccess();
    stubAccountNonPiiStreamingNonAccordionOrganicSuccess();
    stubUtilitySecurityQuestionsSuccess();
};
export const stubTransactionUpsellTermSuccess = () => {
    stubPurchaseNewAccountStreamingNonAccordionOrganicUpsellTerm();
    stubAccountNonPiiStreamingNonAccordionOrganicUpsellTerm();
    stubUtilitySecurityQuestionsSuccess();
};
