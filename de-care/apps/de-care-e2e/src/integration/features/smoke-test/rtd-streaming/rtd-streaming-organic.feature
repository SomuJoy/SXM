Feature: RTD Streaming Organic Trial

    Scenario: Customer attempts to complete the flow with a follow-on when eligible for trial
        Given a customer enters the RTD streaming flow
        When the user enters their information and selects a follow on
        And the user is eligible for the offer
        Then the user should be able to successfully complete their purchase

    Scenario: Customer attempts to complete the flow with the follow-on when ineligible for trial
        Given a customer enters the RTD streaming flow
        When the user enters their information and selects a follow on
        And the user is ineligible for the offer
        Then the user should be redirected to checkout with fallbackOffersLoaded query param set to true

    Scenario: Customer completes the flow with no follow on when eligible for trial
        Given a customer enters the RTD streaming flow
        When the customer enters their information and clicks the Start My Trial button
        And the user is eligible for the offer
        Then the user should be able to successfully start their trial

    Scenario: Customer completes flow with no follow on when ineligible for trial
        Given a customer enters the RTD streaming flow
        When the customer enters their information and clicks the Start My Trial button
        And the user is ineligible for the offer
        Then the user should be redirected to checkout with fallbackOffersLoaded query param set to true

# TODO: Add back when 730000 is merged into develop and then into 740000
# Scenario: customer attempts to enter the flow with no promoCode or programCode
#     Given a customer attempts to enter the RTD streaming flow
#     When the url does not contain a promoCode or programCode query param
#     Then the user should be redirected to organic checkout