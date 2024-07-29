Feature: Third Party Linking - Device Link Amazon

    Scenario: Landing page initial load
        Given the customer visits the link Amazon device URL
        Then they should immediately see the message about being redirected

    Scenario: Landing page after Amazon page launch
        Given the customer visits the link Amazon device URL
        When they have been on the page for a few seconds
        Then the landing page should display the redirect updated message
        And a new tab should open with the Amazon login page

    Scenario: Error during final linking
        Given the customer visits the link Amazon device URL
        When the customer successfully logs into their Amazon account
        And the attempt to link on the SiriusXM side fails
        Then the customer should see the error page

    Scenario: Success
        Given the customer visits the link Amazon device URL
        When they successfully link their device
        Then they should see the success page
    
    Scenario: No subscription id in inbound URL
        Given the customer visits the link Amazon device URL with out a subscription id
        Then they should be navigated to the general error page for the app