Feature: Analytics for clicks

    Scenario: Find account - submit button click
        Given A customer clicks the submit button
        Then the EDDL should contain a submit entry for user click