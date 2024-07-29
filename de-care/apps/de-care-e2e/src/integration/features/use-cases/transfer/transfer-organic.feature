Feature: Swap Organic

    Scenario: Swap - radio id error message
        Given A customer qualifies for SWAP
        When they navigate Swap page with subscriptionId
        Then they should see Swap page
        When they input self radio id
        Then they must see The Radio ID you entered is already on this account
        When they input trial radio id which has self pay
        Then they must see Unable to complete this transaction online or your subscription plan is ineligible to transfer
        When they input new radio id with life time plan
        Then they must see Your radio is eligible for a prepaid, lifetime subscription
        When they input new radio id with lacks capabilities
        Then they must see The radio you wish to transfer service to does not support

    Scenario: Swap with trial radio id
        Given A customer qualifies for transfer with AC_AND_SC eligibility
        When they navigate Swap page with subscriptionId
        Then they should see Swap page
        When they input trial radio id
        Then they should see SC page
        Given A customer qualifies for SP
        When the customer successfully completes a transfer
        Then they should see SP complete page

    Scenario: Swap with new radio id
        Given A customer qualifies for transfer with SWAP eligibility
        When they navigate Swap page with subscriptionId
        Then they should see Swap page
        And check swap page information
        When they input new radio id
        Then they should see Swap checkout page
        When they complete payment page
        Then they should see Swap complete page

    Scenario: Swap - they are trying lookup radio id
        Given A customer qualifies for transfer with AC_AND_SC eligibility
        When they navigate Swap page with subscriptionId
        Then they should see Swap page
        When they input new radio id
        Then they should see SC page
        When they are trying lookup radio id
        Then they should see Lookup page
        And they input trial radio id
        Then they should see ACSC page
        Given A customer qualifies for ACSC
        And select AC mode
        When Just add my new car to my accont
        Then they should see transfer complete page