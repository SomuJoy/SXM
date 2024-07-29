Feature: My Account
    Scenario: Dashboard loads
        Given a customer visits the my account experience while logged in
        Then they should be routed to the dashboard experience
    
    Scenario: Subscription management loads
        Given a customer visits the my account experience while logged in
        When they take action to manage a subscription
        Then they should see the subscription CTAs
