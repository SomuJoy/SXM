Feature: Streaming Ineligible Redirect Errors

    Scenario: errors display for checkout streaming
        Given a user is redirected to the checkout streaming ineligible redirect route with an error code in the url
        When the loading overlay appears
        Then copy displays in the overlay and pill

    Scenario: errors display for FLEPZ
        Given a user is redirected to the FLEPZ streaming ineligible redirect route with an error code in the url
        When the loading overlay appears
        Then copy displays in the overlay and pill

# TODO: add tests back in when this code gets put back in
# Scenario: errors display for checkout streaming in french
#     Given a user is redirected to the checkout streaming ineligible redirect route with an error code in the url and lang pref set to french
#     When the loading overlay appears
#     Then copy displays in the overlay and pill

# Scenario: errors display for FLEPZ in french
#     Given a user is redirected to the FLEPZ streaming ineligible redirect route with an error code in the url and lang pref set to french
#     When the loading overlay appears
#     Then copy displays in the overlay and pill