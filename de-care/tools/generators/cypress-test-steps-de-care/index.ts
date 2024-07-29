import { Tree } from '@nrwl/devkit';

const scenariosRegex = /scenario(?:(?!scenario)[\s\S])*/gim;
const scenarioLineRegex = /(?:scenario:)[\w ]*/gim;
const stepsRegex = /^ *(?:given|when|then|and)[\w ]*/gim;
const stepRegex = /(given|when|then|and)([\w ]*)/i;

interface Schema {
    featureFilePath: string;
    viewport: 'desktop' | 'mobile';
}

export default async function (tree: Tree, schema: Schema) {
    await cypressCucumberStepsGenerator(tree, schema);
}

export async function cypressCucumberStepsGenerator(tree: Tree, schema: Schema) {
    const fileContents = tree.read(schema.featureFilePath)!.toString('utf-8');

    const scenarios = matchAll(fileContents, scenariosRegex);
    const set = scenarios.map((scenario) => {
        return {
            scenario: scenario.match(scenarioLineRegex)?.[0].trim(),
            steps: matchAll(scenario, stepsRegex).map((step) => {
                const stepMatch = step.match(stepRegex);
                return {
                    type: capitalize(stepMatch?.[1]?.trim() || ''),
                    text: stepMatch?.[2].trim(),
                };
            }),
        };
    });

    const imports = set.reduce<string[]>((imports, scenario) => {
        const stepTypes = scenario.steps.map((step) => step.type);
        const difference = stepTypes.filter((x) => !imports.includes(x));
        return [...imports, ...difference];
    }, []);

    // TODO: figure out how to not repeat similar steps (might need to put at bottom with a comment to suggest moving out to a shared steps file?)
    const stepsForFile = set.reduce((text, scenario) => {
        const steps = scenario.steps.reduce((stepText, step) => {
            return `${stepText}${step.type}(/^${step.text}$/, () => {\n\t// TODO: add test logic here\n});\n`;
        }, '');
        return `${text}\n// ${scenario.scenario}\n${steps}`;
    }, '');

    const viewport = schema.viewport === 'mobile' ? `cy.viewport('iphone-x');` : ``;

    const file = `import { Before, ${imports.join(', ')} } from '@badeball/cypress-cucumber-preprocessor';
  
Before(() => {
    ${viewport}
});
${stepsForFile}`;

    const featureStepsFilePath = schema.featureFilePath.replace(/.feature$/, '.ts');
    tree.write(featureStepsFilePath, file);
}

export function matchAll(text: string, regex: RegExp) {
    const matches: string[] = [];
    let m;
    while ((m = regex.exec(text)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === scenariosRegex.lastIndex) {
            scenariosRegex.lastIndex++;
        }
        m.forEach((match: string, groupIndex: number) => {
            matches.push(match);
        });
    }
    return matches;
}
export function capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
