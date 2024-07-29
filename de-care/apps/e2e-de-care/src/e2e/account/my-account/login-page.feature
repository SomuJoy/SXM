@myAccount
Feature: My Account
    Scenario: Login success goes to dashboard
        Given a customer visits the my account login page
        When they login using valid credentials
        Then they should be routed to the dashboard experience
    Scenario: Login shows partner message
        Given a customer visits the my account login page
        When they login using credentials tied to a partner account
        Then they should see a message about using the partner site for login
