import * as strings from '@angular-devkit/core/src/utils/strings';
import { libraryGenerator } from '@nrwl/angular/generators';
import { formatFiles, Tree } from '@nrwl/devkit';
import { deleteLibReadmeFile, tempRollbackOfRootJestConfigChange, tempRollbackOfRootPackageJsonChange } from '../.helpers/file-cleanup-functions';

export default async function (tree: Tree, schema: { name: string; domain: string; type: 'state' | 'ui' }) {
    const directory = `domains/${schema.domain}`;
    let name = strings.dasherize(schema.name);
    let parsedTags: string[];
    let addTranslationSupport = false;
    switch (schema.type) {
        case 'state':
            name = `state-${name}`;
            parsedTags = ['type:state', 'scope:domain-state'];
            break;
        case 'ui':
            name = `ui-${name}`;
            parsedTags = ['type:ui', 'scope:domain-ui'];
            break;
    }

    await libraryGenerator(tree, { name, directory, tags: parsedTags.join(',') });
    await deleteLibReadmeFile(tree, { directory, name });

    // temp rollback of undesired file changes
    await tempRollbackOfRootPackageJsonChange(tree);
    await tempRollbackOfRootJestConfigChange(tree);

    await formatFiles(tree);
}
