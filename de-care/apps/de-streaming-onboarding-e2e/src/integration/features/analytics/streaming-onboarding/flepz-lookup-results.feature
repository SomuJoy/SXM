Feature: Analytics for FLEPZ results

    Scenario: No results found
        Given A customer submits the FLEPZ form with no match data
        Then the EDDL should contain entries for no match

    Scenario: Single result found
        Given A customer submits the FLEPZ form with single match data
        Then the EDDL should contain entries for single match

    Scenario: Multiple results found
        Given A customer submits the FLEPZ form with multiple match data
        Then the EDDL should contain entries for two matches