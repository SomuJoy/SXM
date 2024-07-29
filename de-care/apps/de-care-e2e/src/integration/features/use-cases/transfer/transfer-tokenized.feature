Feature: Tokenized AC/SC/SP

    Scenario: AC
        Given A customer qualifies for ACSC
        When they navigate through tokenized AC
        Then they should see AC page
        And Just add my new car to my accont

    Scenario: ACSC - Already Consolidated and No follown
        Given Already Consolidated and No follown
        When they navigate through tokenized AC
        Then they should see Already Consolidated No Follown page

    Scenario: ACSC - Already Consolidated and Has follown
        Given Already Consolidated and Has follown
        When they navigate through tokenized AC
        Then they should see Already Consolidated With Follown page

    Scenario: SC
        Given A customer qualifies for SP
        When they navigate through tokenized SC
        Then they should see SC page
        When the customer successfully completes a transfer
        Then they should see SP complete page

    Scenario: ACSC - Select AC Mode
        Given A customer qualifies for ACSC
        When they navigate through tokenized ACSC
        Then they should see ACSC page
        And select AC mode
        Then Just add my new car to my accont

    Scenario: ACSC - Select SP Mode
        Given A customer qualifies for SP
        When they navigate through tokenized ACSC
        Then they should see ACSC page
        And select SP mode
        When the customer successfully completes a transfer
        Then they should see SP complete page

    Scenario: ACSC - Select SP Mode with no longer own this vehicle
        Given A customer qualifies for SP
        When they navigate through tokenized ACSC
        Then they should see ACSC page
        And select SP mode
        And I no longer own this vehicle.
        When the customer successfully completes a transfer with remove care from account
        Then they should see SP complete page
        Then they should be able to register on the confirmation page