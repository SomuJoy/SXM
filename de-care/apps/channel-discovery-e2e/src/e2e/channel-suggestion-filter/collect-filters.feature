@channelDiscovery
Feature: Channel Suggestsion Filter

    Scenario: User can enter filters and complete
        Given a user visits the channel suggestion filter experience
        When they go through all the filter steps
        Then they should land on the channel suggestion page
