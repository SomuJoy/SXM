This is the monorepo for the Digital Experience (DE) suite of code. It contains apps, libs and tooling.

# Prerequisites

## Node.js

Projects and tooling in this repository require the use of **Node.js**. Over time the version required can change, so a recommended approach for dealing with this is to install a Node.js version manager that can be used to install and switch to different versions as needed.

**Node Version Manager (nvm)**  
[About nvm](https://github.com/nvm-sh/nvm)  
[Install instructions](https://github.com/nvm-sh/nvm#installing-and-updating)  
[How to use](https://github.com/nvm-sh/nvm#usage)

**Node.js version required for repository**

> _The repository comes with a [`.nvmrc`](.nvmrc) file that defines the Node.js version that should be used._

When opening a new terminal at this repository `de-care` directory, **nvm** will identify the existence of the `.nvmrc` file and will switch to use the configured Node.js version for that terminal session. If you don't happen to have the required Node.js version already installed, **nvm** will handle installing it at this point prior to switching to it.

If you happen to have a terminal open with a different Node.js version active, you can run the nvm "use" command (without a version number) to ensure you have the appropriate Node.js version active (this will use the value from the `.nvmrc` file) for this repository:

```
 nvm use
```

# After cloning the repository

## Step 1: Git user settings

Make sure your Git user full name and email for this repository are set to your SiriusXM corp credentials info.

### Setting your Git user full name and email for a single repository

1. Open Terminal.

2. Change the current working directory to this repository.

3. Set a Git user name:

```
git config user.name "YOUR_FULL_NAME"
```

4. Set a Git user email:

```
git config user.email "YOUR_CORP_ACCOUNT_EMAIL"
```

> [More info](https://docs.github.com/en/get-started/getting-started-with-git/setting-your-username-in-git#setting-your-git-username-for-a-single-repository) on Git settings.

## Step 2: Authentication for the npm registry

This repository is configured to use Artifactory as its package source for dependencies.

Artifactory requires authentication to use. To login, run the following and use your SiriusXM corp credentials when prompted:

```
npm login
```

> See the [.npmrc](.npmrc) file to view how the registry is configured

## Step 3: Installing the repository dependencies

Dependencies for this repository are kept consistent across all devs and CI environments by the use of the `package-lock.json` file. When we add or update dependencies we run `npm i` to install the versions and that auto-generates the `package-lock.json` file. This file is part of the committed code, so it comes with the repository branches.

To ensure that your local instance of the repository has the correct dependencies installed for a given branch that you are working on:

1. Open Terminal.
2. Change the current working directory to the top level `de-care` folder in this repository.
3. Run the following **npm** command:

```
npm ci
```

> **Note:** If there are issues during the package installation
>
> -   first ensure that you are using the required Node.js version
> -   if needed, you can use the force flag `npm ci --force`

# Additional documentation

-   Apps
    -   [CARE (commerce and account management)](./apps/de-care/README.md)
    -   [OEM (in dash web based commerce)](./apps/de-oem/README.md)
    -   [Elements (widgets for external use)](apps/de-elements/README.md)
    -   [Onboarding IAP (in app web based registration and credentials management)](./apps/de-streaming-onboarding/README.md)
    -   [Navigation Elements (navigation widgets for external use)](./apps/sxm-ui-navigation/README.md)
-   Tooling
    -   [Generators (schematics)](./tools/generators/README.md)
-   Storybook
    -   [About and usage](./libs/storybook-host/README.md)
