    Scenario: A customer is not eligible for choice and sees the error

        Given A customer has a reactive offer for RTC but not Choice.
        When they click on the URL to purchase the offer.
        Then they should see the comparison grid with the not elligible for choice error.