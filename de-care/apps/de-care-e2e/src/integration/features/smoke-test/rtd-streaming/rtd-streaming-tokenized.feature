Feature: RTD Streaming Tokenized Trial

    Scenario: Customer enters RTD Tokenized Flow and Redirects to Organic RTD because user already has account
        Given a customer enters the RTD streaming tokenized flow
        And the customer has a valid token
        When the customer already has an account
        Then the system should redirect the customer to the organic RTD flow and display the active subscriptions modal

    Scenario: Customer attempts to complete the tokenized flow with a follow-on when eligible for trial
        Given a customer enters the RTD streaming tokenized flow
        And the customer has a valid token
        Then the customer selects a follow on and enters their information
        And the user is eligible for the offer
        Then the user should be able to successfully complete their purchase

    Scenario: Customer attempts to complete the tokenized flow with a follow-on when ineligible for trial
        Given a customer enters the RTD streaming tokenized flow
        And the customer has a valid token
        Then the customer selects a follow on and enters their information
        And the user is ineligible for the offer
        Then the user should be redirected to checkout with fallbackOffersLoaded query param set to true

    Scenario: Customer attempts to complete the tokenized flow with no follow on when eligible for trial
        Given a customer enters the RTD streaming tokenized flow
        And the customer has a valid token
        When the customer enters a valid password and clicks start my trial button
        And the user is eligible for the offer
        Then the user should be able to successfully start their trial

    Scenario: Customer attempts to complete the tokenized flow with no follow on when ineligible for trial
        Given a customer enters the RTD streaming tokenized flow
        And the customer has a valid token
        When the customer enters a valid password and clicks start my trial button
        And the user is ineligible for the offer
        Then the user should be redirected to checkout with fallbackOffersLoaded query param set to true

    Scenario: Customer attempts to enter the RTD streaming tokenized flow with no tkn query param
        Given a customer enters the RTD streaming tokenized flow without a token
        And the customer does not have a tkn query param in the url
        Then the user is redirected to the RTD organic streaming flow

# TODO: Add back when 730000 is merged into develop and then into 740000
# Scenario: customer attempts to enter the flow with no promoCode or programCode
#     Given a customer attempts to enter the RTD streaming tokenized flow
#     When the url does not contain a promoCode or programCode query param
#     Then the user should be redirected to organic checkout