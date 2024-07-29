import { stubAccountNonPiiStreamingAccordionOrganicSuccess } from '../../../../../support/stubs/de-microservices/account';
import { stubPurchaseNewAccountStreamingAccordionOrganicSuccess } from '../../../../../support/stubs/de-microservices/purchase';
import { stubUtilitySecurityQuestionsSuccess } from '../../../../../support/stubs/de-microservices/utility';

export const stubTransactionSuccess = () => {
    stubPurchaseNewAccountStreamingAccordionOrganicSuccess();
    stubAccountNonPiiStreamingAccordionOrganicSuccess();
    stubUtilitySecurityQuestionsSuccess();
};
