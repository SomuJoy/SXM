import { Query as GherkinQuery } from '@cucumber/gherkin-utils';
import { Query } from '@cucumber/query';
import { GherkinDocument } from '@cucumber/messages';
const chalk = require('chalk');
const positiveColorDeuteranopia = '#0089e9';
const negativeColorDeuteranopia = '#cd4b4b';
const positiveColorProtanomaly = '#0089e9';
const negativeColorProtanomaly = '#fa5a28';

const positiveColor = positiveColorDeuteranopia;
const negativeColor = negativeColorDeuteranopia;

export class OutputConsole {
    constructor(private readonly gherkinQuery: GherkinQuery, private readonly cucumberQuery: Query) {}

    printFeatureWithFailedScenarios(gherkinDocument: GherkinDocument) {
        console.log(`\n(${gherkinDocument?.uri})`);
        console.log(chalk.bold(`FEATURE: ${gherkinDocument?.feature?.name}`));
        const scenarios = gherkinDocument?.feature?.children.filter((child) => child.scenario).map((child) => child.scenario);
        scenarios?.forEach((scenario) => {
            let scenarioHasError = false;
            const outputBuffer: string[] = [];
            scenario?.steps?.forEach((step) => {
                const pickleStepIds = this.gherkinQuery.getPickleStepIds(step.id);
                const stepResults = this.cucumberQuery.getPickleStepTestStepResults(pickleStepIds);
                const result = stepResults[0];
                if (result.status === 'FAILED') {
                    scenarioHasError = true;
                    outputBuffer.push(chalk.hex(negativeColor).bold(`      ${step.keyword}${step.text}`));
                    outputBuffer.push(chalk.hex(negativeColor)(`        >> ${result.message}`));
                } else {
                    outputBuffer.push(chalk.hex(positiveColor).bold(`      ${step.keyword}${step.text}`));
                }
            });
            if (scenarioHasError) {
                console.log(`  SCENARIO: ${scenario?.name}`);
                outputBuffer.forEach((message) => console.log(message));
            }
        });
    }
}
