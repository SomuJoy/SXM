import { InjectionToken } from '@angular/core';
import { ZipStateListLookupService, StateData } from './zip-state-list-lookup.service';

export interface ZipBasedStateLookup {
    getState: (zipCode: string) => StateData[];
}

export const ZIP_BASED_STATE_LOOKUP = new InjectionToken<ZipBasedStateLookup>('ZipBasedStateLookup', {
    providedIn: 'root',
    factory: () => new ZipStateListLookupService(),
});
