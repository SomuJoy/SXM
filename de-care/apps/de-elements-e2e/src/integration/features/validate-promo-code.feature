Feature: Validate Promo Code

    Scenario: Promo code is valid
        Given a user is on a page with the validate promo code widget
        When user enters a valid promo code and send the form
        And clicks on continue, page should be redirected to expected redirect url

    Scenario: Promo code is redeemed
        Given a user is on a page with the validate promo code widget
        When user enters a redeemed promo code and send the form
        And clicks on continue, page should display expected redeemed error

    Scenario: Promo code is invalid
        Given a user is on a page with the validate promo code widget
        When user enters an invalid promo code and send the form
        And clicks on continue, page should display expected invalid error