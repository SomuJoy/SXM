Feature: Analytics for FLEPZ results - Ineligibility

    Scenario: Existing SXIR – No Credentials
        Given A customer submits the FLEPZ form
        When the subscription found ineligible status is existingsxirnocredentials
        Then the EDDL should contain entries for existingsxirnocredentials

    Scenario: Existing SXIR – Has Credentials
        Given A customer submits the FLEPZ form
        When the subscription found ineligible status is existingsxir
        Then the EDDL should contain entries for existingsxir

    Scenario: Existing SXIR – Has Credentials but no OAC credentials
        Given A customer submits the FLEPZ form
        When the subscription found ineligible status is existingsxir and oac credentials is false
        Then the EDDL should contain entries for existingsxir with no oac credentials

    Scenario: Standalone
        Given A customer submits the FLEPZ form
        When the subscription found eligible status is sxir_standalone
        Then the EDDL should contain entries for sxir_standalone

    Scenario: Non-Pay Account
        Given A customer submits the FLEPZ form
        When the subscription found ineligible status is paymentissues
        Then the EDDL should contain entries for paymentissues

    Scenario: Expired OEM AA Trial
        Given A customer submits the FLEPZ form
        When the subscription found ineligible status is expiredaatrial
        Then the EDDL should contain entries for expiredaatrial

    Scenario: Insufficient Radio Package
        Given A customer submits the FLEPZ form
        When the subscription found ineligible status is insufficientpackage
        Then the EDDL should contain entries for insufficientpackage

    Scenario: Non-Consumer Account
        Given A customer submits the FLEPZ form
        When the subscription found ineligible status is nonconsumer
        Then the EDDL should contain entries for nonconsumer

    Scenario: Trial Too Recent
        Given A customer submits the FLEPZ form
        When the subscription found ineligible status is trialwithinlasttrialdate
        Then the EDDL should contain entries for trialwithinlasttrialdate

    Scenario: Max Lifetime Trials Reached
        Given A customer submits the FLEPZ form
        When the subscription found ineligible status is maxlifetimetrials
        Then the EDDL should contain entries for maxlifetimetrials