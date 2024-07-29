Feature: Change Subscription Request with Token

    Scenario: Customer with valid token and eligible for the upgrade

        Given a customer with valid token is eligible for the upgrade
        When they navigate to the change subscription URL with tokenized link
        Then they should see a step for choosing a package with the first one being preselected

    Scenario: Customer chooses to take a preselected package

        Given a customer with valid token is eligible for the upgrade
        When they navigate to the change subscription URL with tokenized link
        And they click continue with the preselected package
        Then they should be able to complete the change subscription transaction

    Scenario: Customer with valid token has already upgraded the plan

        Given a customer with valid token has already upgraded the plan
        When they navigate to the change subscription URL with tokenized link
        Then they should see the upgraded subscription header

    Scenario: Customer with valid token and not eligible for upgrade

        Given a customer with valid token is not eligible for upgrade
        When they navigate to the change subscription URL with tokenized link
        Then they should see the expired offer error in the header

    Scenario: Customer with invalid token
        
        Given a customer with invalid token
        When they navigate to the change subscription URL with tokenized link
        Then they should be redirected to the BAU login page