@DEX-35968
Feature: Multiple subscriptions found variants for FLEPZ results

    Scenario: All subscriptions do not have streaming support
        Given A customer lands on the multiple results page with subscriptions that do not have streaming support
        Then the customer should be presented with the upgrade messaging
        And the customer should not be presented with the other subscriptions messaging
        And the customer should not be presented with the load more button

    Scenario: All subscriptions are inactive
        Given A customer lands on the multiple results page with inactive subscriptions
        Then the customer should be presented with the reactivate messaging
        And the customer should not be presented with the other subscriptions messaging
        And the customer should not be presented with the load more button

    Scenario: All subscriptions have streaming support
        Given A customer lands on the multiple results page with subscriptions with streaming support
        Then the customer should be presented with the start listening messaging
        And the customer should not be presented with the other subscriptions messaging
        And the customer should not be presented with the load more button

    Scenario: Some subscriptions have streaming support
        Given A customer lands on the multiple results page with subscriptions with streaming support and all other variants
        Then the customer should be presented with the start listening messaging
        And the customer should be presented with the other subscriptions sub-headline messaging
        And the customer should not be presented with the load more button
