Feature: Hulu Checkout Flow

    Scenario: Entry Into The Hulu Flow
        When I navigate to the URL with the right programCode
        Then I should see the Hulu hero header
        And I should see a Hulu promo deal card
        And The accordion should be collapsed by default
        When I hit the view more button, I should see the hulu promo details
