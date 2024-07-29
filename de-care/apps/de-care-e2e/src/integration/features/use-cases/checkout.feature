Feature: checkout request

    Scenario: RTC Proactive Targeted flow
        Given A customer qualifies for RTC offers
        When they navigate through RTC proactive targeted flow
        And they should see RTC targeted landing page
        Then they could select any RTC offer and click on continue
        And they should be redirected to checkout targeted flow with an rtc programcode

    Scenario: RTC Reactive Targeted flow
        Given An authenticated customer looking for RTC offers
        When they navigate through RTC reactive targeted flow
        Then they should see checkout RTC targeted page
        And they could select any rtc package with a valid billing info
        Then they should be redirected to complete review your order step
        And they could agree and continue
        Then they navigate to checkout Thank you page 

    Scenario: RTC Reactive Organic flow
         Given A customer looking for RTC offers
         When they navigate through RTC reactive organic flow
         Then they should see checkout RTC organic page
         And they should use their account info for authenticating themselves
         Then they should be redirected to billing information step
         And they could select any rtc package with a valid billing info
         Then they should be redirected to complete review your order step
         And they could agree and continue
         Then they navigate to checkout Thank you page 