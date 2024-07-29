Feature: Trial activation RTP

    Scenario: Valid Trial RTP
        Given the customer has a trial rtp offer on their account
        When they enter PHX with a valid radioId
        Then they should reach step 2 of 3

    Scenario: Valid Trial RTP submission
        Given the customer has a trial rtp offer on their account
        And they enter PHX with a valid radioId
        When they submit the create-account form with valid data
        Then they should reach step 3 of 3

    Scenario: Valid Trial RTP, Customer chooses "not your car"
        Given the customer has a trial rtp offer on their account
        When they enter PHX with a valid radioId
        And they choose the link for incorrect vehicle
        Then they should see a placeholder redirect page

    Scenario: Valid Trial RTP with renewal options submission
        Given the customer has a trial rtp offer that qualifies for roll to choice
        When they submit the create-account form with valid data
        And they select a renewal plan
        Then they should reach the review page

    Scenario: Valid Trial RTP with lead offer options submission
        Given the customer has a trial rtp offer that qualifies for pick a plan
        When they submit the create-account form with valid data
        And they select a lead offer plan
        Then they should reach the review page