Feature: Trial Activation RTP Data layer

    Scenario: Create Account page is rendered
        Given the customer lands on the trial activation RTP create account page
        When they enter PHX with a valid radioId
        Then there should be a track event for the page loaded
        And there should be a record for the radio id
        And there should be a record for the program code
        And there should be a record for the promo code
        And there should be a record for the device status
        And there should be a record for the customer type
        And there should be a record for the session id
        And there should be a record for the transaction id

    Scenario: The Create Account form is submitted
        Given the customer lands on the trial activation RTP create account page
        When they enter PHX with a valid radioId   
        And they submit the create-account form with valid data
        Then they should reach step 3 of 3
        And there should track an event for the review page loaded

    Scenario: The customer completes his order and reaches the confirmation page
        Given the customer lands on the trial activation RTP create account page
        When they enter PHX with a valid radioId   
        And they submit the create-account form with valid data
        And they complete the order and reach the confirmation page
        Then they should reach the confirmation page
        And there should be a tack event for the review page loaded        
         