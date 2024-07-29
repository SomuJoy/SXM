@myAccount
Feature: My Account
    Scenario: Dashboard loads
        Given a customer visits the my account experience while logged in
        Then they should be routed to the dashboard experience

    Scenario: Dashboard loads an offer for an account with an active subscription
        Given a customer visits the my account experience while logged in
        Then they should be shown an offer

    Scenario: Dashboard routes to subscription page
        Given a customer visits the my account experience while logged in
        When they take action to view all subscriptions
        Then they should be routed to the subscriptions page

    Scenario: Dashboard presents three subscription cards
        Given a customer with multiple subscriptions visits the my account experience while logged in
        Then they should be shown three subscriptions cards

    Scenario: Account shell shows a price change message if any plan on the account qualifies
        Given a customer with an account with a price change eligible plan visits the my account experience while logged in
        Then the customer should be presented with a price change message

    Scenario: Dashboard presents platinum two device bundle overlay for next or forward plans
        Given a customer with a one platinum bundle next or forward plans visits the my account experience while logged in
        Then the customer should be presented with a platinum bundle overlay when user has only one next or forward plan