Feature: RFLZ Widget Error Redirect to Phoenix

    Scenario: Redirect to subscribe/checkout/flepz/ineligible-redirect?errorCode=101 when error code of 101
        Given a customer is presented the RFLZ widget
        When the customer enters there information
        And clicks the check my eligiblity button 101
        Then the system redirects to Phoenix FLEPZ with the error code of 101

    Scenario: Redirect to subscribe/checkout/flepz/ineligible-redirect?errorCode=109 when error code of 109
        Given a customer is presented the RFLZ widget
        When the customer enters there information
        And clicks the check my eligiblity button 109
        Then the system redirects to Phoenix FLEPZ with the error code of 109

    Scenario: Redirect to subscribe/checkout/flepz/ineligible-redirect?errorCode=111 when error code of 111
        Given a customer is presented the RFLZ widget
        When the customer enters there information
        And clicks the check my eligiblity button 111
        Then the system redirects to Phoenix FLEPZ with the error code of 111

    Scenario: Redirect to subscribe/checkout/flepz/ineligible-redirect?errorCode=113 when error code of 113
        Given a customer is presented the RFLZ widget
        When the customer enters there information
        And clicks the check my eligiblity button 113
        Then the system redirects to Phoenix FLEPZ with the error code of 113

    Scenario: Redirect to subscribe/checkout/streaming/ineligible-redirect?errorCode=3494 when error code of 3494
        Given a customer is presented the RFLZ widget
        When the customer enters there information
        And clicks the check my eligiblity button 3494
        Then the system redirects to Phoenix with the error code of 3494

    Scenario: Redirect to subscribe/checkout/streaming/ineligible-redirect?errorCode=103 when error code of 103
        Given a customer is presented the RFLZ widget
        When the customer enters there information
        And clicks the check my eligiblity button 103
        Then the system redirects to Phoenix with the error code of 103

    Scenario: Redirect to subscribe/checkout/streaming/ineligible-redirect?errorCode=5035 when error code of 5035
        Given a customer is presented the RFLZ widget
        When the customer enters there information
        And clicks the check my eligiblity button 5035
        Then the system redirects to Phoenix with the error code of 5035