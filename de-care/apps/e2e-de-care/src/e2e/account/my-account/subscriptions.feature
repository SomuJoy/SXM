@myAccount
Feature: My Account
    Scenario: Subscription management loads
        Given a customer visits the my account experience while logged in
        When they take action to manage a subscription
        Then they should see the subscription CTAs
        Then there should be a subscription ID parameter in the url

    Scenario: Show edit nickname if account subscription has a nickname
        Given a customer with a device nickname visits the my account experience while logged in
        When they take action to manage a subscription
        Then the edit radio nickname button should be visible
        When they click on the edit radio nickname link
        Then the edit radio nickname form should be visible

    Scenario: Infotainment section loads
        Given a customer with a infotainment subscription visits the my account experience while logged in
        When they take action to manage a subscription
        Then the infotainment section should be visible

    Scenario: Subscription details - audio account card shows a price change message if any plan on the subsription qualifies
        Given a customer with a audio subscription with a price change eligible plan visits the my account experience while logged in
        When they take action to manage a subscription
        Then the customer should be presented with a price change message for audio subscription
