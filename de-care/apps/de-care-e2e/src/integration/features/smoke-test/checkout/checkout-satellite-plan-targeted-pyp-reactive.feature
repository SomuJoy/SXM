Feature: Checkout Satellite Plan Targeted PYP Reactive

    Scenario: Experience loads correct offers for 3FOR1AAPYP
        Given a customer visits the page with the program code 3FOR1AAPYP
        Then they should be presented with the correct default selected offer and the option to choose another

    Scenario: Experience with a token loads correct offers for 3FOR1AAPYP
        Given a customer visits the page with a token and the program code 3FOR1AAPYP
        Then they should be presented with the correct default selected offer and the option to choose another

    Scenario: Experience loads correct offers and VehicleInfo for 3FOR1AAPYP
        Given a customer with vehicleInfo visits the page with the program code 3FOR1AAPYP
        Then the vehicleInfo should be displayed correctly

    Scenario: Customer with an existing trial can purchase offer for 3FOR1AAPYP
        Given a customer with an existing trial goes through the targeted satellite purchase steps with the program code 3FOR1AAPYP
        When the customer successfully completes a transaction
        Then they should land on the confirmation page

    Scenario: Customer can register after purchase of offer for 3FOR1AAPYP
        Given a customer with an existing trial goes through the targeted satellite purchase steps with the program code 3FOR1AAPYP
        When the customer successfully completes a transaction
        Then they should be able to register on the confirmation page

    Scenario: Customer with an existing active subscription with no follow on
        Given a customer with an existing active subscription visits the page with the program code 3FOR1AAPYP
        Then they should be redirected to the active subscription found page
        And the subscription summary should include the renewal date

    Scenario: Customer with an existing active subscription with follow on
        Given a customer with an existing active subscription with follow on visits the page with the program code 3FOR1AAPYP
        Then they should be redirected to the active subscription found page
        And the subscription summary should not include the renewal date

    Scenario: Experience redirects to legacy checkout flow when program code is not allowed
        Given a customer visits the page with a program code that is not 3FOR1AAPYP or 3FOR1SELPYP or 3FOR1MMPYP
        Then they should be redirected to the legacy targeted checkout URL with the query params persisted

    Scenario: Experience redirects to legacy checkout flow when upcode is in the query params
        Given a customer visits the page with an upcode
        Then they should be redirected to the legacy targeted checkout URL with the query params persisted

    Scenario: Experience redirects to legacy checkout flow when promocode is in the query params
        Given a customer visits the page with an promocode
        Then they should be redirected to the legacy targeted checkout URL with the query params persisted

    Scenario: Experience redirects to legacy checkout organic flow when account not found based on account number
        Given a customer visits the page with an invalid account number
        Then they should be redirected to the legacy organic checkout URL

    Scenario: Experience redirects to legacy checkout organic flow when account not found based on token
        Given a customer visits the page with an invalid token
        Then they should be redirected to the legacy organic checkout URL