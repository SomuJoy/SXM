import * as strings from '@angular-devkit/core/src/utils/strings';
import { libraryGenerator } from '@nrwl/angular/generators';
import { formatFiles, Tree } from '@nrwl/devkit';
import { deleteLibReadmeFile, tempRollbackOfRootJestConfigChange, tempRollbackOfRootPackageJsonChange } from '../.helpers/file-cleanup-functions';

export default async function (tree: Tree, schema: { name: string }) {
    let directory = 'shared/sxm-ui';
    let name = strings.dasherize(schema.name);
    if (name.includes('/')) {
        const namePieces = name.split('/');
        name = namePieces.pop();
        directory = `${directory}/${namePieces.join('/')}`;
    }
    let parsedTags = ['type:ui', 'scope:shared-ui'];
    if (!name.startsWith('ui-')) {
        name = `ui-${name}`;
    }

    await libraryGenerator(tree, { name, directory, tags: parsedTags.join(','), prefix: 'sxm-ui' });
    await deleteLibReadmeFile(tree, { directory, name });

    // temp rollback of undesired file changes
    await tempRollbackOfRootPackageJsonChange(tree);
    await tempRollbackOfRootJestConfigChange(tree);

    await formatFiles(tree);
}
