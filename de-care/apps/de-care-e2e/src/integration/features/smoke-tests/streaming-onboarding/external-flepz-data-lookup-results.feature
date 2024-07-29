Feature: Page destinations for inbound FLEPZ data lookup results

    Scenario: No results found
        Given A customer visits the lookup URL with FLEPZ data that results in no match data
        Then the customer should be navigated to the page for no match

    Scenario: Single result needing credentials found
        Given A customer visits the lookup URL with FLEPZ data that results in single match needing credentials data
        Then the customer should be navigated to the page for create credentials

    Scenario: Single result has credentials found
        Given A customer visits the lookup URL with FLEPZ data that results in single match has credentials data
        Then the customer should be navigated to the page for existing credentials

    Scenario: Multiple results found
        Given A customer visits the lookup URL with FLEPZ data that results in multiple match data
        Then the customer should be navigated to the page for multiple matches

    Scenario: Invalid flepz data structure
        Given A customer visits the lookup URL with an invalid FLEPZ data value
        Then the customer should be navigated to the page for find account

    Scenario: Missing flepz data query param
        Given A customer visits the lookup URL with no FLEPZ data query param
        Then the customer should be navigated to the page for find account