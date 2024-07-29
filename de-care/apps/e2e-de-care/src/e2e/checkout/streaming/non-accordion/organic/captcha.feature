@checkoutDigital
Feature: Checkout Streaming Plan Organic (Captcha)

    Scenario: Customer should get a captcha on the review step if captcha required
        When a customer goes through the organic streaming purchase steps with a valid program code and captcha is required
        Then they should be presented with the captcha field on the review order step
        Then they should be able to answer the captcha and submit the transaction
        Then they should land on the confirmation page
