@checkoutSatellite
Feature: Checkout Satellite Zero Cost (Transaction Failures)

    Scenario: Customer should get a general system error on the account step after transaction submission
        When a customer visits the page with a valid promo code
        Then a customer goes through the zero cost steps and a system error occurs on purchase transaction
        Then they should shown a general system error message

    Scenario: Customer should get a username error on the account step after transaction submission
        When a customer visits the page with a valid promo code
        Then a customer goes through the zero cost steps and a username error occurs on purchase transaction
        Then they should be shown a username error message

    Scenario: Customer should get a username in use error on the account step after transaction submission
        When a customer visits the page with a valid promo code
        Then a customer goes through the zero cost steps and a username in use error occurs on purchase transaction
        Then they should be shown a username in use error message
