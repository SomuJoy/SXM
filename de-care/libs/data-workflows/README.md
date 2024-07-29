# data-workflows

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test data-workflows` to execute the unit tests.

## Purpose

This lib is used to encapsulate business logic around making
microservice calls in succession as well as side effects that
are required to occur during that business logic.

Examples:

> Loading a lead offer for a targeted customer requires
> calling account identification endpoint prior to calling offer
> endpoint.

> A successful call to nonPii should result in a side effect
> of a data layer tracking event
