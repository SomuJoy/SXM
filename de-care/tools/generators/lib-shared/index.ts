import * as strings from '@angular-devkit/core/src/utils/strings';
import { formatFiles, Tree } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/workspace';
import { deleteLibDefaultTSFile, deleteLibReadmeFile, tempRollbackOfRootJestConfigChange, tempRollbackOfRootPackageJsonChange } from '../.helpers/file-cleanup-functions';

export default async function(tree: Tree, schema: { name: string; type: 'util' | 'ui-util' | 'state' | 'ui' }) {
    let directory = 'shared';
    let name = strings.dasherize(schema.name);
    if (name.includes('/')) {
        const namePieces = name.split('/');
        name = namePieces.pop();
        directory = `${directory}/${namePieces.join('/')}`;
    }
    let parsedTags: string[];
    switch (schema.type) {
        case 'util':
            parsedTags = ['type:util', 'scope:shared-util'];
            break;
        case 'ui-util':
            parsedTags = ['type:ui-util', 'scope:shared-ui-util'];
            break;
        case 'state':
            parsedTags = ['type:state', 'scope:shared-state'];
            break;
        case 'ui':
            parsedTags = ['type:ui', 'scope:shared-ui'];
            break;
    }

    await libraryGenerator(tree, { name, directory, tags: parsedTags.join(','), skipBabelrc: true });
    await deleteLibReadmeFile(tree, { directory, name });
    await deleteLibDefaultTSFile(tree, { directory, name });

    // temp rollback of undesired file changes
    await tempRollbackOfRootPackageJsonChange(tree);
    await tempRollbackOfRootJestConfigChange(tree);

    await formatFiles(tree);
}
