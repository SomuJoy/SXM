Feature: Tier Up (Upgrade) Targeted

    Scenario: Experience loads correctly
        Given an eligible customer visits the page with the program code UPM3MOAAFREE
        Then they should be presented with the correct upgrade offer

    Scenario: Transaction can be completed
        Given an eligible customer visits the page with the program code UPM3MOAAFREE
        When they select use card on file and continue from the payment step
        And they accept the terms and submit the transaction
        Then they should be redirected to the confirmation page