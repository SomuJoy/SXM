Feature: Canada Price Increase For PYOP

    Scenario: Updated price displayes in the Offer Details and Grid for ROC
        Given a customer from Canada ROC visits FLEPZ with a PYOP programCode
        Then the updated ROC price displays in the Offer Details and Grid

    Scenario: Updated price displayes in the Offer Details and Grid for QC
        Given a customer from Canada QC visits FLEPZ with a PYOP programCode
        Then the updated QC price displays in the Offer Details and Grid