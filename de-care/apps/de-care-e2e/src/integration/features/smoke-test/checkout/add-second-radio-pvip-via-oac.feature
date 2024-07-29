Feature: Checkout PVIP Add second Radio

    Scenario: Experience loads account
        Given a customer visits the page with subscription Id and account number
        Then they should be presented with the list of radios and option to find a second radio

    Scenario: Experience click on View more radios accordion, select Find Second radio and click continue
        Given a customer click on the 'View more radios' option to 'Find second radio'
        Then they should be presented with the 'Find second radio' option in the form of radio button
        And a customer notice select radio button with labeled 'Find second radio'
        Then they should be presented with modal popup with options to find with 'Radio ID'
        And a customer choose search by Radio ID option and click continue
        Then they should be presented with modal popup with options to enter 'Radio ID' in Input

    Scenario: Experience enter radio Id and click continue to search radio informaiton
        When a customer will enter closed radio id in the modal and click continue to search radio
        Then they should be presented with modal popup with search result of radio information

    Scenario: Experience continue with the radio informaiton that should go to review stepper
        Given a customer click continue button on the searched radio
        Then they should be presented with review stepper with quote summary

    Scenario: Experience continue with the radio informaiton that should go to review page
        Given a customer click continue button on the review component with new closed second radio
        Then they should be presented with confirmation page
