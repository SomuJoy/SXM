@checkoutDigital
Feature: Trial activation streaming negative flow

Scenario: When customer have a closed subscription account then he should get fallback offer
When a user visits trial activation streaming url then they will get offer based on promocode
Then the user have to enter closed subscription email id and continue the process
Then user has to fill out account info and login info
And click on start my trial button
Then it will navigate to default fallback offer