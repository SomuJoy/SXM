@checkoutDigital
Feature: Checkout Digital Trial Activation Roll to Drop (RTD) Organic Non-Accordion

    Scenario: Experience loads offer correctly for program code
        When a customer visits the streaming trial activation roll to drop experience with a valid program code
        Then they should be presented with the correct offer

    Scenario: Customer can complete a trial activation transaction with follow on option page presented
        When a customer visits the streaming trial activation roll to drop experience with a valid program code
        Then they should be presented with the correct offer
        Then they will see credentials step
        Then they will see account info form step
        Then they should see the follow on option page

    Scenario: Customer can complete a trial activation transaction without follow on option page presented
        When a customer visits the streaming trial activation roll to drop experience with a valid program code and skip renewal param
        Then they should be presented with the correct offer
        Then they will see credentials step
        Then they will see account info form step
        Then they should see the confirmation page

    Scenario: Customer can complete a trial activation transaction and buy an follow on
        When a customer visits the streaming trial activation roll to drop experience with a valid program code
        Then they should be presented with the correct offer
        Then they will see credentials step
        Then they will see account info form step
        Then they could select to add a follow on and continue
        Then user could enter payment information