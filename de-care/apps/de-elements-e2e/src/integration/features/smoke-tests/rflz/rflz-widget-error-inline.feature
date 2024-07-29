Feature: RFLZ Widget Error Inline

    Scenario: Displays error in pill in rflz widget when error code of 106
        Given a customer is presented the RFLZ widget
        When the customer enters there information
        And clicks the check my eligiblity button 106
        Then the system displays the error message in the alert pill inline of the rflz widget

    Scenario: Displays error in pill in rflz widget when error code of 107
        Given a customer is presented the RFLZ widget
        When the customer enters there information
        And clicks the check my eligiblity button 107
        Then the system displays the error message in the alert pill inline of the rflz widget

    Scenario: Displays error in pill in rflz widget when error code of 110
        Given a customer is presented the RFLZ widget
        When the customer enters there information
        And clicks the check my eligiblity button 110
        Then the system displays the error message in the alert pill inline of the rflz widget

    Scenario: Displays error in pill in rflz widget when error code of 114
        Given a customer is presented the RFLZ widget
        When the customer enters there information
        And clicks the check my eligiblity button 114
        Then the system displays the error message in the alert pill inline of the rflz widget