Feature: Change Subscription Request with data only
    Scenario: Self-Pay Data only, Audio Capable
        Given a satellite customer with a subscription that has No Audio service and only a Self-Pay Data service
        When the customer navigates into PHX Change plan flow
        Then they should see all Audio packages they can add to their subscription
        And they should see Data packages that they can change too
        When they select their billing term options
        Then they should continue to the checkout steps

    Scenario: Data Trial with no follow-on and more than 1 year left in the trial
        Given a satellite customer with a subscription that has No Audio service and a Data trial with no follow-on and > 1 year left on the trial
        When the customer navigates into PHX Change plan flow
        Then they should only see Audio packages they can add to their subscription, no data options displayed
        And they select their billing term options
        Then they should continue to the checkout steps
        
    Scenario: Data Trial with no follow-on and less than 1 year left in the trial
        Given a satellite customer with a subscription that has No Audio service and a Data trial with no follow-on and < 1 year left on the trial
        When the customer navigates into PHX Change plan flow
        Then they should see all Audio packages they can add
        And they should see Data packages that they can add to their subscription
        When they select their billing term options
        Then they should continue to the checkout steps

    Scenario: Data Trial with a follow-on 
        Given a satellite customer with a subscription that has No Audio service and a Data trial with follow-on 
        When the customer navigates into PHX Change plan flow
        Then they should see all Audio packages they can add to their own subscription
        And they should see Data packages that they can add to their subscription
        When they select their billing term options
        Then they should continue to the checkout steps