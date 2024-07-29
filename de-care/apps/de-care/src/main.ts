/* NOTE: commenting out module federation logic until we are ready to go live */

// import { loadRemoteEntry } from '@angular-architects/module-federation';
// import { environment } from './environments/environment';
//
// const { moduleFederationRemoteEntries } = environment;
//
// Promise.all(Object.keys(moduleFederationRemoteEntries).map((key) => loadRemoteEntry(moduleFederationRemoteEntries[key], key)))
//     .catch((err) => console.error('Error loading remote entries', err))
//     .then(() => import('./bootstrap'))
//     .catch((err) => console.error(err));

import('./bootstrap').catch((err) => console.error(err));
