Feature: CMS integration for offers in satellite targeted

    Scenario: With upsells
        Given a targeted customer visits the satellite checkout URL
        Then the hero should be correct
        And the lead offer card should be correct
        And the upsell options should be correct