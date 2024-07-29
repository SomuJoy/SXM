import { Injectable } from '@angular/core';

export interface StateData {
    state: string;
    key: string;
}

@Injectable({ providedIn: 'root' })
export class ZipStateListLookupService {
    getState(zipCode: Readonly<string>): StateData[] {
        const zipBasedStates: StateData[] = [];
        stateList.forEach((stateDetail) => {
            if (stateDetail?.zip === zipCode) {
                zipBasedStates.push({ state: stateDetail.state, key: stateDetail.key });
            }
        });
        return zipBasedStates;
    }
}

const stateList: { state: string; key: string; zip: string }[] = [
    { state: 'RHODE ISLAND', key: 'RI', zip: '02861' },
    { state: 'MASSACHUSETTS', key: 'MA', zip: '02861' },
    { state: 'KENTUCKY', key: 'KY', zip: '42223' },
    { state: 'TENNESSEE', key: 'TN', zip: '42223' },
    { state: 'MONTANA', key: 'MT', zip: '59221' },
    { state: 'NORTH DAKOTA', key: 'ND', zip: '59221' },
    { state: 'ILLINOIS', key: 'IL', zip: '63673' },
    { state: 'MISSOURI', key: 'MO', zip: '63673' },
    { state: 'ARKANSAS', key: 'AR', zip: '71749' },
    { state: 'LOUISIANA', key: 'LA', zip: '71749' },
    { state: 'OKLAHOMA', key: 'OK', zip: '73949' },
    { state: 'TEXAS', key: 'TX', zip: '73949' },
    { state: 'COLORADO', key: 'CO', zip: '81137' },
    { state: 'NEW MEXICO', key: 'NM', zip: '81137' },
    { state: 'ARIZONA', key: 'AZ', zip: '84536' },
    { state: 'UTAH', key: 'UT', zip: '84536' },
    { state: 'ARIZONA', key: 'AZ', zip: '86044' },
    { state: 'UTAH', key: 'UT', zip: '86044' },
    { state: 'ARIZONA', key: 'AZ', zip: '86515' },
    { state: 'NEW MEXICO', key: 'NM', zip: '86515' },
    { state: 'NEW MEXICO', key: 'NM', zip: '88063' },
    { state: 'TEXAS', key: 'TX', zip: '88063' },
    { state: 'CALIFORNIA', key: 'CA', zip: '89439' },
    { state: 'NEVADA', key: 'NV', zip: '89439' },
    { state: 'CALIFORNIA', key: 'CA', zip: '97635' },
    { state: 'OREGON', key: 'OR', zip: '97635' },
];
