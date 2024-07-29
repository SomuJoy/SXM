Feature: Multiple subscriptions found variants for FLEPZ results with Load More functionality

    Scenario: All subscriptions do not have streaming support
        Given A customer lands on the multiple results page with subscriptions that do not have streaming support
        Then the customer should be presented with the upgrade headline messaging
        And the customer should be presented with the load more button

    Scenario: All subscriptions are inactive
        Given A customer lands on the multiple results page with inactive subscriptions
        Then the customer should be presented with the reactivate headline messaging
        And the customer should be presented with the load more button

    Scenario: All subscriptions have streaming support
        Given A customer lands on the multiple results page with subscriptions with streaming support
        Then the customer should be presented with the start listening headline messaging
        And the customer should be presented with the load more button

    Scenario: Some subscriptions have streaming support
        Given A customer lands on the multiple results page with subscriptions with streaming support and all other variants
        Then the customer should be presented with the start listening headline messaging
        And the customer should be presented with the load more button
        And the customer should be presented with the other subscriptions sub-headline messaging

    Scenario: Some subscriptions have streaming support and initial visible are all streaming
        Given A customer lands on the multiple results page with subscriptions with only streaming support visible and all other variants
        Then the customer should be presented with the start listening headline messaging
        And the customer should not be presented with the other subscriptions sub-headline messaging
        And the customer should be presented with the load more button
        Then the customer should be presented with the other subscriptions sub-headline messaging after loading more

    Scenario: Some subscriptions do not have streaming support and some subscriptions are inactive
        Given A customer lands on the multiple results page with subscriptions that do not have streaming support and inactive subscriptions
        Then the customer should be presented with the other subscriptions headline messaging