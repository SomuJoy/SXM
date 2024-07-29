# Migration for npm cli commands

We introduced `nps` as a way to manage our npm scripts. The new syntax aims to replace `npm run` with `npm start`. `npm start` by itself now provides a full list of available commands.

## Serving

| Old                       | New                         |
| ------------------------- | --------------------------- |
| npm run start             | npm start serve             |
| npm run start:ca          | npm start serve.ca          |
| npm run start:oem         | npm start serve.oem         |
| npm run start:oem:ca      | npm start serve.oem.ca      |
| npm run start:elements    | npm start serve.elements    |
| npm run start:elements:ca | npm start serve.elements.ca |

## Builds

| Old                           | New                             |
| ----------------------------- | ------------------------------- |
| npm run build                 | npm start build                 |
| npm run build:oem             | npm start build.oem             |
| npm run build:elements        | npm start build.elements        |
| npm run bundle:elements       | npm start bundle.elements       |
| npm run build-bundle:elements | npm start build-bundle.elements |

## Cypress (headless)

| Old                          | New                            |
| ---------------------------- | ------------------------------ |
| npm run e2e:de-care          | npm start e2e.de-care          |
| npm run e2e:de-care:open     | npm start e2e.de-care.open     |
| npm run e2e:de-elements      | npm start e2e.de-elements      |
| npm run e2e:de-elements:open | npm start e2e.de-elements.open |
| npm run e2e:storybook        | npm start e2e.storybook        |

## Cypress (UI)

| Old                            | New                              |
| ------------------------------ | -------------------------------- |
| npm run cypress                | npm start cypress                |
| npm run cypress:de-care        | npm start cypress.de-care        |
| npm run cypress:de-care:ca     | npm start cypress.de-care.ca     |
| npm run cypress:de-oem         | npm start cypress.de-oem         |
| npm run cypress:de-oem:ca      | npm start cypress.de-oem.ca      |
| npm run cypress:de-elements    | npm start cypress.de-elements    |
| npm run cypress:de-elements:ca | npm start cypress.de-elements.ca |
| npm run cypress:storybook      | npm start cypress.storybook      |

## Various

| Old                     | New                       |
| ----------------------- | ------------------------- |
| npm run ng              | npm start ng              |
| npm run nx              | npm start nx              |
| npm run test            | npm start test            |
| npm run lint            | npm start lint            |
| npm run e2e             | npm start e2e             |
| npm run storybook       | npm start storybook       |
| npm run build-storybook | npm start build-storybook |
| npm run compodoc        | npm start compodoc        |
| npm run compodocoutput  | npm start compodocoutput  |
|                         |                           |
| npm run affected:test   | npm start affected.test   |
| npm run affected:lint   | npm start affected.lint   |
| npm run ci:full-check   | npm start ci.full-check   |
| npm run local-pre-push  | npm start local-pre-push  |
| npm run format:write    | npm start format.write    |
| npm run schematic       | npm start schematic       |

## Docker

| Old                           | New                             |
| ----------------------------- | ------------------------------- |
| npm run dev:init              | npm start dev.init              |
| npm run dev:reset             | npm start dev.reset             |
| npm run dev:serve:care-us     | npm start dev.serve.care-us     |
| npm run dev:serve:care-ca     | npm start dev.serve.care-ca     |
| npm run dev:serve:oem-us      | npm start dev.serve.oem-us      |
| npm run dev:serve:oem-ca      | npm start dev.serve.oem-ca      |
| npm run dev:serve:elements-us | npm start dev.serve.elements-us |
| npm run dev:serve:elements-ca | npm start dev.serve.elements-ca |
| npm run dev:serve:storybook   | npm start dev.serve.storybook   |
| npm run dev:serve:compodocs   | npm start dev.serve.compodocs   |
| npm run dev:stop              | npm start dev.stop              |
| npm run dev:build:care        | npm start dev.build.care        |
| npm run dev:build:oem         | npm start dev.build.oem         |
| npm run dev:build:elements    | npm start dev.build.elements    |
| npm run dev:build:storybook   | npm start dev.build.storybook   |
| npm run dev:build:compodocs   | npm start dev.build.compodocs   |
| npm run dev:test              | npm start dev.test              |

## No longer needed or redundant

-   npm run local:test
-   npm run local:lint
-   npm run cross-env
-   npm run pretty-quick
-   npm run ci
