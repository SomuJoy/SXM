@checkoutSatellite
Feature: Checkout Satellite Plan Organic Accordion (legacy)

    Scenario: Customer with active trial and a card on file is presented with the option to use it
        Given a customer visits the organic satellite purchase flow
        When they identify with an account that has an active trial and has a card on file
        Then they should be presented with the options to use card on file or enter new card on the payment step

    Scenario: Customer with active trial and a card on file can use card on file
        Given a customer visits the organic satellite purchase flow
        When they identify with an account that has an active trial and has a card on file
        Then they should be able to use card on file and complete the transaction

    Scenario: Customer with active trial and a card on file can use a new payment method
        Given a customer visits the organic satellite purchase flow
        When they identify with an account that has an active trial and has a card on file
        Then they should be able to enter a new payment method and complete the transaction

    Scenario: Customer with active trial and no card on file is not presented with the option
        Given a customer visits the organic satellite purchase flow
        When they identify with an account that has an active trial and no card on file
        Then they should only be presented with the option enter new card on the payment step

    Scenario: Customer with active trial and no card on file can use a new payment method
        Given a customer visits the organic satellite purchase flow
        When they identify with an account that has an active trial and no card on file
        Then the user with no previous card on file should be able to enter a new payment method and complete the transaction