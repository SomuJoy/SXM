@myAccount
@checkoutSatellite
Feature: Multi-Feature - Checkout My Account To Satellite Add Radio Router
 
    Scenario: dashboard-then-radios-found-select
        Given a customer visits the my account experience while logged in
        Then they should be routed to the dashboard experience
        When they choose to add a car and streaming subscription
        Then they should be presented with the select your radio page
        When they continue with the first radio listed
        Then they should be presented with the pick your plan page
        When they select a plan and proceed to payment
        Then they will select and existing card and continue
        Then they will click complete my order and go to confirmation page
        Then they should be able to send the refresh signal

    Scenario: dashboard-then-no-radios-found-lookup
        Given a customer visits the my account experience while logged in
        Then they should be routed to the dashboard experience
        When they choose to add a car and streaming subscription having no available radios
        Then they should be presented with the lookup a radio page

    Scenario: dashboard-then-radios-found-select-then-lookup
        Given a customer visits the my account experience while logged in
        Then they should be routed to the dashboard experience
        When they choose to add a car and streaming subscription
        Then they should be presented with the select your radio page
        When they choose to look up a radio that is not listed
        Then they should be presented with the lookup a radio page
    
    Scenario: dashboard-then-radios-found-select-then-lookup-new-radio
        Given a customer visits the my account experience while logged in
        Then they should be routed to the dashboard experience
        When they choose to add a car and streaming subscription
        Then they should be presented with the select your radio page
        When they choose to look up a radio that is not listed
        Then they should be presented with the lookup a radio page
        When they enter a new radio they should be taken to the pick your plan page

    Scenario: dashboard-then-lookup
        Given a customer visits the my account experience while logged in
        When they take action to view all subscriptions
        Then they should be routed to the subscriptions page
        When they choose to add find subscriptions to add
        Then they should be presented with the lookup a radio page
    
    Scenario: dashboard-then-lookup-new-radio
        Given a customer visits the my account experience while logged in
        When they take action to view all subscriptions
        Then they should be routed to the subscriptions page
        When they choose to add find subscriptions to add
        Then they should be presented with the lookup a radio page
        When they enter a new radio they should be taken to the pick your plan page

    Scenario: dashboard-then-reactivate closed radio
        Given a customer visits the my account experience while logged in with an inactive radio
        Then they should be routed to the dashboard experience
        When they take action to view all subscriptions
        When they choose to reactivate an inactive radio
        Then they should be presented with the pick your plan page
        When they select a plan and proceed to payment
        Then they will select and existing card and continue
        Then they will click complete my order and go to confirmation page