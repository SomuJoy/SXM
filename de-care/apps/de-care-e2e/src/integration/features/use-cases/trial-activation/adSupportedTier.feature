Feature: Ad Supported Tier (AST)

    Scenario: Ad supported tier correct activation
        Given A customer looking for activate the ad supported tier
        When they hit LAST url
        And they should see LAST confirmation page

    Scenario: Ad supported tier already active
        Given An already activated customer looking for activating the ad supported tier
        When they hit LAST url
        And they should see core error 500 page