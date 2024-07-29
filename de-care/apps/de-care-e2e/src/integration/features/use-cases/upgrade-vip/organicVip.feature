Feature: Upgrade VIP Organic

    Scenario: (Positive) Customer upgraded to Platinum VIP with 2 radios

        Given an eligible customer looking to upgrade 2 radios
        When they enter the Platinum VIP flow
        And they verify their first radio
        And the primary radio is found and eligible
        Then they should see the info about their first radio
        And they add the second radio
        And the second radio is found and eligible
        Then they should be able to complete their purchase with 2 radios

    Scenario: (Positive) Customer looking to upgrade to Platinum VIP without second radio

        Given an eligible customer looking to upgrade 1 radio
        When they enter the Platinum VIP flow
        And they verify their first radio
        And the primary radio is found and eligible
        Then they can proceed with only one radio
        And they should be able to complete their purchase with 1 radio

    Scenario: (Negative) Customer looking to upgrade to Platinum VIP with ineligible second radio

        Given a customer with ineligible second radio
        When they enter the Platinum VIP flow
        And they verify their first radio
        And the primary radio is found and eligible
        And they add the second radio that is ineligible
        Then they should see the ineligibility error
