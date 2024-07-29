@checkoutDigital
Feature: Checkout Digital Plan Organic Non-Accordion (With Campaign Content)

    Scenario: Experience gracefully falls back when campaign content is not found
        When a customer visits the page with utm_content for a campaign id string that is not valid
        Then they should be presented with the correct offer without any UI error for missing campaign content

    Scenario: Experience loads with campaign content
        When a customer visits the page with utm_content for a campaign id string that is valid
        Then they should be presented with campaign content

    Scenario: Experience loads with campaign content with no background image
        When a customer visits the page with utm_content for a campaign id string that is valid and the campaign does not have a background image
        Then they should be presented with campaign content and the hero should not have a background image
