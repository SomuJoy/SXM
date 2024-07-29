import { cyGetOfferDescriptionFooter, mockStorybookOfferLeadOfferDetails } from '@de-care/shared/e2e';
import { cyGetOfferPromoPriceAndTerm } from '../support/app.po';

describe('de-care-e2e', () => {
    beforeEach(() => {
        cy.visit('/iframe.html?selectedKind=offers&selectedStory=lead-offer-details');
    });

    it('should display welcome message', () => {
        cyGetOfferPromoPriceAndTerm().should(elem => {
            // This is an example of sharing data between storybook and associated cypress tests
            expect(elem.text()).to.equal(`${mockStorybookOfferLeadOfferDetails.termLength} months for $${mockStorybookOfferLeadOfferDetails.pricePerMonth}/mo`);
        });

        cyGetOfferDescriptionFooter().should(elem =>
            expect(elem.text()).to.contain('Listen & watch your favorites in all your favorite places—in your car, on your phone or at home')
        );
    });
});
