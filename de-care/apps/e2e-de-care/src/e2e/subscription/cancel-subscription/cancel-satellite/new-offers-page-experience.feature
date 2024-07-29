@retain
Feature: New offers page experience

    Scenario: Experience loads the side to side offers page
        Given the cancel service response is enabling the new offers page experience
        When a customer navigates to the Cancel subscription experience
        And selects any cancel reason to continue
        Then the app should load the side to side offers page


    Scenario: Experience loads the plan comparison grid modal
        Given the cancel service response is enabling the new offers page experience
        When a customer navigates to the Cancel subscription experience
        And selects any cancel reason to continue
        And clicks on the compare the offers link
        Then the experience displays the plan comparison grid