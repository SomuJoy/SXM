# Running Tests

## Unit Tests

-   Run `npm start test` to run all tests in the repository.
-   Run `ng test <name-of-lib-or-app>` to execute the unit tests for a specific lib or app.
-   Run `git fetch && npm start "affected.test -- --base=origin/<name-of-target-pr-branch>"` to execute the unit tests required based on the current code changes.
    <br/>(example: `npm start "affected:test -- --base=origin/project/CARE_RELEASE_0060000"`)
