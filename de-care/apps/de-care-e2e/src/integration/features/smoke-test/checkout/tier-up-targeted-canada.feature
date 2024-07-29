Feature: Tier Up (Upgrade) Targeted - Canada

    Scenario: Experience loads correctly
        Given an eligible customer visits the page with the program code CAUPM3MOAAFREE
        Then they should be presented with the correct upgrade offer
        And the language toggle should be present in the header