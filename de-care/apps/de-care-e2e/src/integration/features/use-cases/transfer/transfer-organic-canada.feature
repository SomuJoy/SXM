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

    Scenario: Swap - radio id error message - French
        Given A customer qualifies for SWAP
        When they navigate Swap page with subscriptionId - fr
        Then they should see Swap page - fr
        When they input self radio id
        Then they must see The Radio ID you entered is already on this account - fr
        When they input trial radio id which has self pay
        Then they must see Unable to complete this transaction online or your subscription plan is ineligible to transfer - fr
        When they input new radio id with life time plan
        Then they must see Your radio is eligible for a prepaid, lifetime subscription - fr
        When they input new radio id with lacks capabilities
        Then they must see The radio you wish to transfer service to does not support - fr
