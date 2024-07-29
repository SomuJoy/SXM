import { GherkinDocument, Scenario } from '@cucumber/messages';
import { loadEnvelopesFromFile } from './envelope-loader';
import { OutputConsole } from './output-console';
import { initQueryEngine } from './query-engine';
import { Query as GherkinQuery } from '@cucumber/gherkin-utils';
import { Query as CucumberQuery } from '@cucumber/query';

export class GherkinMessageFormatter {
    private readonly _gherkinQuery: GherkinQuery;
    private readonly _cucumberQuery: CucumberQuery;
    private readonly _gherkinDocuments: readonly GherkinDocument[];
    private _failedGherkinDocuments: GherkinDocument[];

    constructor(ndjsonFilePath: string) {
        const envelopes = loadEnvelopesFromFile(ndjsonFilePath);
        const { gherkinQuery, cucumberQuery } = initQueryEngine(envelopes);
        this._gherkinQuery = gherkinQuery;
        this._cucumberQuery = cucumberQuery;
        this._gherkinDocuments = gherkinQuery.getGherkinDocuments();
        this._failedGherkinDocuments = this._parseFailed();
    }

    results(): { passed: number; failed: number; filesWithFailures: number } {
        const failed = this._failedGherkinDocuments.reduce((failed, gherkinDocument) => {
            const scenarios = gherkinDocument?.feature?.children.filter((child) => child.scenario).map((child) => child.scenario);
            const scenarioFails = scenarios?.filter((scenario) => {
                return scenario?.steps?.some((step) => {
                    const pickleStepIds = this._gherkinQuery.getPickleStepIds(step.id);
                    const stepResults = this._cucumberQuery.getPickleStepTestStepResults(pickleStepIds);
                    return stepResults?.[0]?.status === 'FAILED';
                });
            });
            return scenarioFails ? failed + scenarioFails.length : failed;
        }, 0);
        return {
            passed: 0,
            failed,
            filesWithFailures: this._failedGherkinDocuments.length,
        };
    }

    consoleLogFailed() {
        const outputConsole = new OutputConsole(this._gherkinQuery, this._cucumberQuery);
        if (this._failedGherkinDocuments.length > 0) {
            console.log(`Files with failures: ${this._failedGherkinDocuments.length}`);
            this._failedGherkinDocuments.forEach((gherkinDocument) => outputConsole.printFeatureWithFailedScenarios(gherkinDocument));
        }
        console.log();
    }

    private _parseFailed() {
        return this._gherkinDocuments.reduce<GherkinDocument[]>((failures, doc) => {
            const scenarios = doc?.feature?.children.filter((child) => child.scenario).map((child) => child.scenario);
            const hasFailures = scenarios?.some((scenario) => {
                return scenario?.steps?.some((step) => {
                    const pickleStepIds = this._gherkinQuery.getPickleStepIds(step.id);
                    const stepResults = this._cucumberQuery.getPickleStepTestStepResults(pickleStepIds);
                    return stepResults?.[0]?.status === 'FAILED';
                });
            });
            if (hasFailures) {
                failures.push(doc);
            }
            return failures;
        }, []);
    }
}
