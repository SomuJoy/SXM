Feature: Canada Price Increase For FLEPZ Organic

    Scenario: (Organic) Update the price displayed in the Offer Details when programCode of CAMORESELECT
        Given a customer from Canada QC visits the organic FLEPZ flow
        When the users route has a programCode of CAMORESELECT
        Then the correct price of 21.60 should be displayed in the Offer Details

    Scenario: (Organic) Update the price displayed in the Offer Details when programCode of CAMOREALLACCESS
        Given a customer from Canada QC visits the organic FLEPZ flow
        When the users route has a programCode of CAMOREALLACCESS
        Then the correct price of 27.60 should be displayed in the Offer Details

    Scenario: (Organic) Update the price displayed in the Offer Details when programCode of CAMOREMUSIC
        Given a customer from Canada QC visits the organic FLEPZ flow
        When the users route has a programCode of CAMOREMUSIC
        Then the correct price of 15.60 should be displayed in the Offer Details

    Scenario: (Targeted) Update the price displayed in the Offer Details when programCode of CAMORESELECT
        Given a customer from Canada QC visits the targeted FLEPZ flow
        When the users route has a programCode of CAMORESELECT and radioId and lname
        Then the correct price of 21.60 should be displayed in the Targeted Offer Details

    Scenario: (Targeted) Update the price displayed in the Offer Details when programCode of CAMOREALLACCESS
        Given a customer from Canada QC visits the targeted FLEPZ flow
        When the users route has a programCode of CAMOREALLACCESS and radioId and lname
        Then the correct price of 27.60 should be displayed in the Targeted Offer Details

    Scenario: (Targeted) Update the price displayed in the Offer Details when programCode of CAMOREMUSIC
        Given a customer from Canada QC visits the targeted FLEPZ flow
        When the users route has a programCode of CAMOREMUSIC and radioId and lname
        Then the correct price of 15.60 should be displayed in the Targeted Offer Details