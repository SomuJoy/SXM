import { e2eAdSupportedTierOneClickConfirmationPage } from '@de-care/de-care-use-cases/trial-activation/feature-ad-supported-tier-one-click';

export const cyGetAdSupportedTierOneClickConfirmationPage = () => cy.get(e2eAdSupportedTierOneClickConfirmationPage);
export const cyGetCoreError500Page = () => cy.get('de-care-general-error-page');
