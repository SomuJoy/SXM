Feature: Page destinations for FLEPZ results

    Scenario: No results found
        Given A customer submits the FLEPZ form with no match data
        Then the customer should be navigated to the page for no match

    Scenario: Single result needing credentials found
        Given A customer submits the FLEPZ form with single match needing credentials data
        Then the customer should be navigated to the page for create credentials

    Scenario: Single result has credentials found
        Given A customer submits the FLEPZ form with single match has credentials data
        Then the customer should be navigated to the page for existing credentials

    Scenario: Multiple results found
        Given A customer submits the FLEPZ form with multiple match data
        Then the customer should be navigated to the page for multiple matches