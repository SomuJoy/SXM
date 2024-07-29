The **CARE** application provides web based commerce transactions (purchases, trial activations, etc) as well as account management.

> **Note:**  
> The application uses a localization strategy in which different instances of the application code are deployed and configured based on a target locale (currenty US and Canada).

# Architecture overview

The application runs in a browser and makes network calls to a **Microservice** layer for retreiving data and executing commands for account commerce. The microservices endpoints exist outside of this repository so the application must be able to access those when the applciation is served locally (with the exception of running End to End tests).

# Serving the application locally

There are CI environments that are set up to host the microservices based on different repository branch instances. When serving the application locally we need to be able to indicate what CI enviornment to use for the microservices integration. This repository comes with a Node.js script for serving the application based on CI environment.

1. Determine which CI environment number you want to use (see the [DESK App](https://desk-de-ui.ingress.devtest.corp.siriusxm.com/care-oac)).
2. Open Terminal.
3. Change the current working directory to the top level `de-care` folder in this repository.
4. Use the Node.js script to serve the application based on CI number.

```
node ./tools/scripts/serve-by-environment-care.ts --ci=5
```

This script will handle configuring the microservices endpoint URL based on the CI environment and will also handle launching the application with the locale configuration based on the CI environment.

> _Take a look at the script output to know what PORT the application is running on._

# Building the application

The application can be built locally using the following command:

```
npx nx run cuwi:build:production
```

> See the [`project.json`](./project.json) file for more info on the build executor configurations

# Running End to End (e2e) test coverage for the application

The repository provides a Node.js script for running the e2e coverage for this application. This script starts by serving the application and then exectutes the e2e coverage in headless mode (without opening a browser window). At the end of execution it will either output all tests passed or will output a report of only the failing tests.

```
npm run ci:e2e:care
```

> **Note:** The e2e coverage is vast and will take a little while to fully run.
