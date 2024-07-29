import { wrapAngularDevkitSchematic } from '@nrwl/devkit/ngcli-adapter';

export const componentGenerator = wrapAngularDevkitSchematic('@schematics/angular', 'component');
export const serviceGenerator = wrapAngularDevkitSchematic('@schematics/angular', 'service');
