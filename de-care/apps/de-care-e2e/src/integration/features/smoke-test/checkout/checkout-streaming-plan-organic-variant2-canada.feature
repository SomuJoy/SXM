Feature: Checkout Streaming Plan Organic Variant2

    Scenario: Experience loads correct offer for CATMSRTP3MOFREE
        Given a customer visits the page with the program code CATMSRTP3MOFREE
        Then they should be presented with the correct offer

    Scenario: Customer can purchase offer for CATMSRTP3MOFREE
        Given a customer goes through the organic streaming purchase steps with the program code CATMSRTP3MOFREE
        When the customer successfully completes a transaction
        Then they should land on the confirmation page

    Scenario: Customer can use gift card and purchase offer for CATMSRTP3MOFREE
        Given a customer goes through the organic streaming purchase steps using a gift card and with the program code CATMSRTP3MOFREE
        When the customer successfully completes a transaction
        Then they should land on the confirmation page

    Scenario: Customer can register after purchase of offer for CATMSRTP3MOFREE
        Given a customer goes through the organic streaming purchase steps with the program code CATMSRTP3MOFREE
        When the customer successfully completes a transaction
        Then they should be able to register on the confirmation page

    Scenario: Customer can skip registration after purchase of offer for CATMSRTP3MOFREE
        Given a customer goes through the organic streaming purchase steps with the program code CATMSRTP3MOFREE
        When the customer successfully completes a transaction and registration is not needed
        Then they should not see the registration UI on the confirmation page

    Scenario: Customer should get a fallback offer when not eligible for CATMSRTP3MOFREE
        Given a customer goes through the organic streaming purchase steps with the program code CATMSRTP3MOFREE and non-qualifying data
        Then they should be presented with a fallback offer

    Scenario: Customer with single streaming subscription and offer for CATMSRTP3MOFREE
        Given a customer uses an email address that has a single streaming subscription when visiting the page with the program code CATMSRTP3MOFREE
        Then they should be presented with the subscription found modal and the listen link

    Scenario: Customer with multiple streaming subscription and offer for CATMSRTP3MOFREE
        Given a customer uses an email address that has multiple streaming subscriptions when visiting the page with the program code CATMSRTP3MOFREE
        Then they should be presented with the subscription found modal and multiple listen links

    Scenario: Customer with single trial subscription and offer for CATMSRTP3MOFREE
        Given a customer uses an email address that has a single trial subscription when visiting the page with the program code CATMSRTP3MOFREE
        Then they should be presented with the subscription found modal and the subscribe link

    Scenario: Customer with single trial subscription and offer for CATMSRTP3MOFREE
        Given a customer uses an email address that has multiple trial subscriptions and some with follow ons when visiting the page with the program code CATMSRTP3MOFREE
        Then they should be presented with the subscription found modal and the subscribe link and listen link

    Scenario: Customer should get a credit card error for expired cc on the payment step after transaction submission of offer for CATMSRTP3MOFREE
        Given a customer goes through the organic streaming purchase steps with the program code CATMSRTP3MOFREE and invalid credit card expiration
        Then they should be taken back to the payment step and shown an error message in the credit card section

    Scenario: Customer should get a credit card error for fraud on the payment step after transaction submission of offer for CATMSRTP3MOFREE
        Given a customer goes through the organic streaming purchase steps with the program code CATMSRTP3MOFREE and invalid credit card
        Then they should be taken back to the payment step and shown an error message in the credit card section

    Scenario: Customer should get a general system error on the payment step after transaction submission of offer for CATMSRTP3MOFREE
        Given a customer goes through the organic streaming purchase steps with the program code CATMSRTP3MOFREE and a system error occurs on purchase transaction
        Then they should be taken back to the payment step and shown a general system error message in the credit card section

    Scenario: Customer should get a captcha on the review step if captcha required on offer for CATMSRTP3MOFREE
        Given a customer goes through the organic streaming purchase steps with the program code CATMSRTP3MOFREE and captcha is required
        Then they should be presented with the captcha field on the review order step
        And they should be able to answer the captcha and submit the transaction

    Scenario: Customer should get a password error on the credentials step after transaction submission of offer for CATMSRTP3MOFREE
        Given a customer goes through the organic streaming purchase steps with the program code CATMSRTP3MOFREE and a password error occurs on purchase transaction
        Then they should be taken back to the credentials step and shown a password error message
