const { concurrent, series, ifWindows } = require('nps-utils');

module.exports = {
    scripts: {
        affected: {
            test: {
                default: {
                    hiddenFromHelp: true,
                    script: 'nps test.all',
                    description: 'Test all apps and libs',
                },
                silent: {
                    hiddenFromHelp: true,
                    script: 'nx affected:test --passWithNoTests=true --silent --parallel',
                    description: 'Test all apps and libs but suppress console.logs within tests',
                },
            },
            lint: {
                hiddenFromHelp: true,
                script: 'nx affected:lint --parallel',
            },
        },
        build: {
            default: {
                script: 'ng build cuwi --configuration production --base-href /HOST_CONTEXT_TOKEN_TO_REPLACE/ --deploy-url ngapp/',
                description: 'Build de-care app',
            },
            oem: {
                script: 'ng build de-oem --configuration production --base-href /HOST_CONTEXT_TOKEN_TO_REPLACE/ --deploy-url ngapp/',
                description: 'Build de-oem app',
            },
            elements: {
                script: 'ng build de-elements --configuration production --base-href /HOST_CONTEXT_TOKEN_TO_REPLACE/ --deploy-url ngapp/',
                description: 'Build elements app',
            },
            onboarding: {
                script: 'ng build de-streaming-onboarding --configuration production --base-href /HOST_CONTEXT_TOKEN_TO_REPLACE/',
                description: 'Build streaming-onboarding app',
            },
            navElements: {
                script: 'ng build sxm-ui-navigation --configuration production --base-href /HOST_CONTEXT_TOKEN_TO_REPLACE/ --deploy-url ngapp/',
                description: 'Build sxm ui navigation elements app',
            },
        },
        'build-bundle': {
            elements: {
                script: series('nps build.elements', 'nps bundle.elements'),
                description: 'Build and bundle elements',
            },
            navElements: {
                script: series('nps build.navElements', 'nps bundle.navElements'),
                description: 'Build and bundle sxm ui navigation elements',
            },
        },
        bundle: {
            elements: {
                script: 'node apps/de-elements/build-bundle.js dist/apps/de-elements dist/apps/de-elements-bundle de-care-elements',
                description: 'Bundle elements (need to `buildBundle` first)',
            },
            navElements: {
                script: 'node apps/sxm-ui-navigation/build-bundle.js dist/apps/sxm-ui-navigation dist/apps/sxm-ui-navigation-bundle sxm-ui-navigation',
                description: 'Bundle sxm ui navigation elements (need to `buildBundle` first)',
            },
        },
        'build-storybook': {
            script: 'nx run storybook-host:build-storybook --quiet',
            description: 'Build storybook',
        },
        ci: {
            default: concurrent({
                test: 'nps affected.test.silent',
                build: 'nps build',
                'build-oem': 'nps build.oem',
                'build-elements': 'nps build.elements',
                'build-storybook': 'nps buildStorybook',
                nsync: 'nps nsync',
            }),
            'full-check': {
                script: 'nps "dev.init docker build --build-arg NODE_VARS=ci --tag build-dev -f ./operations/build-check.dockerfile ."',
                description: '',
            },
        },

        compodoc: {
            script: 'npx compodoc -p ./.compodoc/tsconfig.json -w -s --port 8888',
            description: 'Generate compodocs with watcher',
        },
        compodocoutput: {
            script: 'npx compodoc -p ./.compodoc/tsconfig.json --output compodocs',
            description: 'Generate compodocs output',
        },
        // Cypress e2e tests (live)
        cypress: {
            default: {
                script: 'nps cypress.care',
                description: 'Run Cypress for de-care with UI: Make sure you are serving the right application (`serve.care` or `dev.serve.care`).',
            },
            care: {
                default: {
                    script: 'cd apps/de-care-e2e && cross-env CYPRESS_REMOTE_DEBUGGING_PORT=9223 cypress open',
                    description: 'Run Cypress for de-care with UI: Make sure you are serving the right application (`serve.care` or `dev.serve.care`).',
                },
                ca: {
                    script: 'cd apps/de-care-e2e && cross-env CYPRESS_REMOTE_DEBUGGING_PORT=9223 cypress open --env isCanada=true',
                    description: 'Run Cypress for de-care in Canada with UI: Make sure you are serving the right application (`serve.care.ca` or `dev.serve.care-ca`).',
                },
            },
            oem: {
                default: {
                    script: 'cross-env CYPRESS_REMOTE_DEBUGGING_PORT=9223 ng e2e de-oem-e2e --watch',
                    description: 'Run Cypress for de-oem with UI.',
                },
                ca: {
                    script: 'cross-env CYPRESS_REMOTE_DEBUGGING_PORT=9223 ng e2e de-oem-e2e --configuration=canada --watch',
                    description: 'Run Cypress for de-oem in Canada with UI.',
                },
            },
            elements: {
                default: {
                    script: 'cross-env CYPRESS_REMOTE_DEBUGGING_PORT=9223 ng e2e de-elements-e2e --watch',
                    description: 'Run Cypress for de-elements with UI.',
                },
                ca: {
                    script: 'cross-env CYPRESS_REMOTE_DEBUGGING_PORT=9223 ng e2e de-elements-e2e --configuration=canada --watch',
                    description: 'Run Cypress for de-elements in Canada with UI.',
                },
            },
            onboarding: {
                default: {
                    script: 'cross-env CYPRESS_REMOTE_DEBUGGING_PORT=9223 ng e2e de-streaming-onboarding-e2e --watch',
                    description: 'Run Cypress for de-streaming-onboarding with UI.',
                },
                ca: {
                    script: 'cross-env CYPRESS_REMOTE_DEBUGGING_PORT=9223 ng e2e de-streaming-onboarding-e2e --configuration=canada --watch',
                    description: 'Run Cypress for de-streaming-onboarding in Canada with UI.',
                },
            },
            storybook: {
                script: 'cd apps/storybook-e2e && cross-env CYPRESS_REMOTE_DEBUGGING_PORT=9223 cypress open',
                description: 'Run Cypress for storybook with UI: Make sure you are serving the right application (`serve.storybook` or `dev.serve.storybook`).',
            },
        },
        // Docker
        dev: {
            build: {
                care: {
                    hiddenFromHelp: true,
                    script: 'docker build --rm --build-arg NODE_VARS=build --tag build-dev -f ./operations/build-check.dockerfile .',
                    description: 'Docker: build de-care',
                },
                oem: {
                    hiddenFromHelp: true,
                    script: 'docker build --rm --build-arg NODE_VARS=build:oem --tag build-dev -f ./operations/build-check.dockerfile .',
                    description: 'Docker: build de-oem',
                },
                elements: {
                    hiddenFromHelp: true,
                    script: 'docker build --rm --build-arg NODE_VARS=build:elements --tag build-dev -f ./operations/build-check.dockerfile .',
                    description: 'Docker: build elements',
                },
                navElements: {
                    hiddenFromHelp: true,
                    script: 'docker build --rm --build-arg NODE_VARS=build:navElements --tag build-dev -f ./operations/build-check.dockerfile .',
                    description: 'Docker: build sxm-ui-navigation',
                },
                storybook: {
                    hiddenFromHelp: true,
                    script: 'docker build --rm --build-arg NODE_VARS=build-storybook --tag build-dev -f ./operations/build-check.dockerfile .',
                    description: 'Docker: build storybook',
                },
                compodocs: {
                    hiddenFromHelp: true,
                    script: 'docker build --rm --build-arg NODE_VARS=compodocoutput --tag build-dev -f ./operations/build-check.dockerfile .',
                    description: 'Docker: build compodocs',
                },
            },
            check: {
                hiddenFromHelp: true,
                script: 'cd .. && docker-compose up preCheck',
                description: 'Docker: Run the pre-push checks',
            },
            init: {
                hiddenFromHelp: true,
                script: ifWindows(
                    'cd .. && cross-env-shell NPM_TOKEN=$NPM_TOKEN docker build --build-arg NPM_TOKEN=$NPM_TOKEN --tag angular-dev -f ./de-care/operations/development.dockerfile . && docker-compose up npmInstall',
                    'cd .. && docker build --rm --tag angular-dev -f ./de-care/operations/development.dockerfile . && docker-compose up npmInstall'
                ),
                description: 'Docker: Initialize docker for this workspace (take a while and needs to be done when package.json dependencies change)',
            },
            install: {
                hiddenFromHelp: true,
                script: 'cd .. && docker-compose up install',
            },
            preCheck: {
                hiddenFromHelp: true,
                script: 'cd .. && docker-compose up preCheck',
                description: 'Run all CI checks in container',
            },
            removeNodeModules: {
                hiddenFromHelp: true,
                script: 'docker volume rm dev_node_modules',
            },
            reset: {
                script: series('nps dev.stop', 'docker image prune -f', 'nps dev.init'),
                description: 'Docker: Remove all docker containers in this workspace and re-initialize.',
            },
            // serve and up: use serve to be able to ctrl-c out of it to stop; up to leave it running in the background.
            ...createDockerScriptsForApps(['care', 'care-ca', 'oem', 'oem-ca', 'elements', 'elements-ca', 'storybook', 'compodocs']),
        },

        // Cypress e2e tests (headless)
        e2e: {
            default: {
                script: 'nx e2e',
                description: 'Run all e2e tests',
            },
            care: {
                default: {
                    script: 'nx e2e de-care-e2e --headless',
                    description: 'Run all de-care e2e tests headless',
                },
                open: {
                    script: 'nx e2e de-care-e2e',
                    description: 'Run all de-care e2e tests while showing the browser window',
                },
            },
            elements: {
                default: {
                    script: 'nx e2e de-elements-e2e --headless',
                    description: 'Run all de-elements e2e tests headless',
                },
                open: {
                    script: 'nx e2e de-elements-e2e',
                    description: 'Run all de-elements e2e tests while showing the browser window',
                },
            },
            onboarding: {
                default: {
                    script: 'nx e2e de-streaming-onboarding-e2e --headless',
                    description: 'Run all de-streaming-onboarding e2e tests headless',
                },
                open: {
                    script: 'nx e2e de-streaming-onboarding-e2e',
                    description: 'Run all de-streaming-onboarding e2e tests while showing the browser window',
                },
            },
            storybook: {
                script: 'nx e2e storybook-e2e --headless',
                description: 'Run all storybook e2e tests headless',
            },
        },

        format: {
            write: {
                hiddenFromHelp: true,
                script: 'pretty-quick',
                description: 'Re-format all files according to the workspace rules',
            },
        },

        lint: {
            default: {
                script: 'nx lint',
                description: 'Test specific projects',
            },
            all: {
                script: 'nx affected:lint --all --parallel',
                description: 'Lint all file locally',
            },
        },

        'local-pre-push': {
            script: series('nps "affected.test.silent --base=origin/develop"', 'nps "affected.lint --base=origin/develop"', 'nps nsync'),
            description: 'Run this before pushing up your PR',
        },

        ng: {
            script: 'ng',
            description: 'Run angular CLI directly',
        },

        nsync: {
            script: 'nps "schematic nsync"',
            description: 'Verify if your workspace files are in sync with the workspace config files',
        },

        nx: {
            script: 'nx',
            description: 'Run nx commands directly',
        },

        'pretty-quick': {
            hiddenFromHelp: true,
            script: 'pretty-quick',
            description: 'Re-format all changed files according to workspace config',
        },

        // Nx
        schematic: {
            script: 'nx workspace-schematic',
            description: 'Run a schematic',
        },

        // Serving the applications
        serve: {
            default: {
                script: 'nps serve.care',
                description: 'Run the de-care app locally',
            },
            care: {
                default: {
                    script: 'nx serve --host 0.0.0.0 --disable-host-check --port=4200',
                    description: 'Run the de-care app locally (port 4200)',
                },
                ca: {
                    script: 'nx serve --host 0.0.0.0 --disable-host-check --configuration=canada --port=4201',
                    description: 'Run the de-care app locally for Canada (port 4201)',
                },
            },
            oem: {
                default: {
                    script: 'nx serve de-oem',
                    description: 'Run the de-oem app locally',
                },
                ca: {
                    script: 'nx serve de-oem --configuration=canada',
                    description: 'Run the de-oem app locally for Canada',
                },
            },
            elements: {
                default: {
                    script: 'nx serve de-elements',
                    description: 'Run the de-elements app locally',
                },
                ca: {
                    script: 'nx serve de-elements --configuration=canada',
                    description: 'Run the de-elements app locally for Canada',
                },
            },
            navElements: {
                default: {
                    script: 'nx serve sxm-ui-navigation',
                    description: 'Run the sxm-ui-navigation app locally',
                },
                ca: {
                    script: 'nx serve sxm-ui-navigation --configuration=canada',
                    description: 'Run the sxm-ui-navigation app locally for Canada',
                },
            },
            onboarding: {
                default: {
                    script: 'nx serve de-streaming-onboarding',
                    description: 'Run the de-streaming-onboarding app locally',
                },
                ca: {
                    script: 'nx serve de-streaming-onboarding --configuration=canada',
                    description: 'Run the de-streaming-onboarding app locally for Canada',
                },
            },
        },

        storybook: {
            script: 'nx storybook storybook-host --quiet',
            description: 'Serve storybook as application on port 6006',
        },

        test: {
            default: {
                script: 'nx test',
                description: 'Test specific projects',
            },
            all: {
                script: 'nx affected:test --passWithNoTests --all --parallel',
                description: 'Test all files',
            },
        },

        uml: {
            default: 'nps uml.start',
            start: {
                script: 'docker run --rm --name "de-care-plantuml-server" -d -p 9601:8080 plantuml/plantuml-server:jetty',
                description: 'Start the docker container with plantUML server',
            },
            stop: {
                script: 'docker stop de-care-plantuml-server',
                description: 'Stop (and auto-remove) the docker container with plantUML server',
            },
        },
    },
};

function createDockerScriptsForApps(apps) {
    const defaults = {
        serve: {
            default: {
                script: 'nps dev.serve.care',
                description: 'Serve de-care in a docker container (ctrl-c to stop). Make sure to init or reset first.',
            },
        },
        up: {
            default: {
                hiddenFromHelp: true,
                script: 'nps dev.up.care',
                description: 'Serve de-care in a docker container (use `stop` command to exit and `logs` to view live logs). Make sure to init or reset first.',
            },
        },
        logs: {
            default: {
                hiddenFromHelp: true,
                script: 'nps dev.logs.care',
                description: 'View logs from the de-care container.',
            },
        },
        stop: {
            default: {
                script: 'docker-compose down',
                description: 'Shutdown all docker containers',
            },
        },
    };

    return apps.reduce((accum, containerKey) => {
        accum.serve[containerKey] = {
            script: `cd .. && docker-compose up ${containerKey}`,
            description: `Docker: serve app ${containerKey} (ctrl-c to exit)`,
        };
        accum.up[containerKey] = {
            hiddenFromHelp: true,
            script: `cd .. && docker-compose up -d ${containerKey}`,
            description: `Docker: serve app ${containerKey} HEADLESS (use dev.stop.${containerKey} to stop, and dev.logs.${containerKey} to examine logs)`,
        };
        accum.stop[containerKey] = {
            hiddenFromHelp: true,
            script: `docker-compose stop ${containerKey}`,
            description: `Docker: stop app ${containerKey}`,
        };
        accum.logs[containerKey] = {
            hiddenFromHelp: true,
            script: `docker-compose logs -f ${containerKey}`,
            description: `Docker: examine logs for app ${containerKey}`,
        };

        return accum;
    }, defaults);
}
