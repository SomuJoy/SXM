@myAccount
@checkoutSatellite
Feature: Multi-Feature - Negative Cases - Checkout My Account To Satellite Add Radio Router

Scenario: dashboard-then-radios-found-select-then-lookup-new-radio
        Given a customer visits the my account experience while logged in
        Then they should be routed to the dashboard experience
        When they choose to add a car and streaming subscription
        Then they should be presented with the select your radio page
        When they choose to look up a radio that is not listed
        Then they should be presented with the lookup a radio page
        When they enter a an invalid radio they should be presented with an error

Scenario: dashboard-then-lookup-new-radio
        Given a customer visits the my account experience while logged in
        When they take action to view all subscriptions
        Then they should be routed to the subscriptions page
        When they choose to add find subscriptions to add
        Then they should be presented with the lookup a radio page
        When they enter a an invalid radio they should be presented with an error

Scenario: dashboard-then-radios-found-select-then-lookup-active-trial
        Given a customer visits the my account experience while logged in
        Then they should be routed to the dashboard experience
        When they choose to add a car and streaming subscription
        Then they should be presented with the select your radio page
        When they choose to look up a radio that is not listed
        Then they should be presented with the lookup a radio page
        When they enter an active trial they should be routed to AC_SC

Scenario: dashboard-then-radios-found-select-then-lookup-active-self-pay
        Given a customer visits the my account experience while logged in
        Then they should be routed to the dashboard experience
        When they choose to add a car and streaming subscription
        Then they should be presented with the select your radio page
        When they choose to look up a radio that is not listed
        Then they should be presented with the lookup a radio page
        When they enter an active self-pay they should be routed to Transfer Error page