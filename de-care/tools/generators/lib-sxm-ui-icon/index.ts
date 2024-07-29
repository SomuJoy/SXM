import * as strings from '@angular-devkit/core/src/utils/strings';
import { libraryGenerator } from '@nrwl/angular/generators';
import { formatFiles, generateFiles, joinPathFragments, readProjectConfiguration, Tree } from '@nrwl/devkit';
import { deleteLibReadmeFile, tempRollbackOfRootJestConfigChange, tempRollbackOfRootPackageJsonChange } from '../.helpers/file-cleanup-functions';

export default async function (tree: Tree, schema: { name: string }) {
    const nameDasherized = strings.dasherize(schema.name);
    const nameCapitalized = nameDasherized
        .split('-')
        .map(([firstLetter, ...rest]) => `${firstLetter.toUpperCase()}${rest.join('')}`)
        .join(' ');
    const directory = 'shared/sxm-ui';
    const libName = `ui-icon-${nameDasherized}`;
    const parsedTags = ['type:ui', 'scope:shared-ui'];
    await libraryGenerator(tree, { name: libName, directory, tags: parsedTags.join(','), prefix: 'sxm-ui' });
    await deleteLibReadmeFile(tree, { directory, name: libName });

    const project = `shared-sxm-ui-ui-icon-${nameDasherized}`;
    const projectConfig = readProjectConfiguration(tree, project);
    const libRoot = `${projectConfig.sourceRoot}/lib`;
    const filesPath = joinPathFragments(__dirname, './files');
    generateFiles(tree, filesPath, libRoot, {
        name: nameDasherized,
        nameCapitalized,
        module: project,
        classify: strings.classify,
        dasherize: strings.dasherize,
    });

    // temp rollback of undesired file changes
    await tempRollbackOfRootPackageJsonChange(tree);
    await tempRollbackOfRootJestConfigChange(tree);

    await formatFiles(tree);
}
