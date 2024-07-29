@checkoutDigital
Feature: Checkout Digital Plan Organic Non-Accordion LPZ verification
    Scenario: Trial Customer can purchase offer
        When a trial customer goes through the organic streaming purchase steps with a valid program code
        Then lpz Modal is presented and the user continues to next step successfully
        Then user is able to complete the transaction