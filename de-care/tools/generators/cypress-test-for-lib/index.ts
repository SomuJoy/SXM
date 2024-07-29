import { formatFiles, generateFiles, joinPathFragments, readProjectConfiguration, Tree } from '@nrwl/devkit';
import { deleteDirectory } from '../.helpers/file-cleanup-functions';
import { getRelativePathToProject } from '../.helpers/project-helper-functions';
import { cypressComponentConfiguration } from '@nrwl/angular/generators';
import { tsConfigAddTypesToCompilerOptions } from '../.helpers/typescript-helper-functions';

interface Schema {
    project: string;
    generateTests: boolean;
}

export default async function (tree: Tree, schema: Schema) {
    await cypressComponentTestGenerator(tree, schema);
}

export async function cypressComponentTestGenerator(tree: Tree, schema: Schema) {
    await cypressComponentConfiguration(tree, {
        project: schema.project,
        skipFormat: false,
        generateTests: schema.generateTests,
        buildTarget: 'component-tester-angular:build:development',
    });

    const projectConfig = readProjectConfiguration(tree, schema.project);

    await deleteDirectory(tree, { directory: `${projectConfig.root}/cypress/fixtures` });

    await tsConfigAddTypesToCompilerOptions(tree, `${projectConfig.root}/cypress/tsconfig.cy.json`, ['cypress-axe']);

    generateFiles(tree, joinPathFragments(__dirname, './files'), projectConfig.root, {
        nodeModulesPath: `${getRelativePathToProject(projectConfig)}node_modules`,
    });

    await formatFiles(tree);
}
