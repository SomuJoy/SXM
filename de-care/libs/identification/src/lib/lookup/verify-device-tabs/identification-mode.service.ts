import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { getCaseInsensitiveQueryParam } from '@de-care/browser-common';
import { Tabs } from './verify-device-tabs.component';

export interface IdentificationMode {
    type: Tabs;
    isSelected: boolean;
}

function createIdentificationMode(type: Tabs, isSelected = false): IdentificationMode {
    return { type, isSelected };
}

@Injectable({ providedIn: 'root' })
export class IdentificationModeService {
    constructor(@Inject(DOCUMENT) private readonly _document: Document) {}

    getIdentificationModes(): IdentificationMode[] {
        const tbView = getCaseInsensitiveQueryParam(this._document.location.search, 'tbView');

        if (tbView) {
            return this._tbViewIdentificationModes(tbView.toUpperCase());
        } else {
            return this._defaultIdentificationModes();
        }
    }

    private _defaultIdentificationModes(): IdentificationMode[] {
        const searchMode = getCaseInsensitiveQueryParam(this._document.location.search, 'searchmode');
        const carInfo = createIdentificationMode('car-info');
        const flepz = createIdentificationMode('account-info');
        switch (searchMode) {
            case 'rid_search': {
                flepz.isSelected = true;
                break;
            }
            case 'flepz_search':
            default: {
                carInfo.isSelected = true;
                break;
            }
        }
        return [carInfo, flepz];
    }

    private _tbViewIdentificationModes(tbViewParam: string): IdentificationMode[] {
        if (tbViewParam === 'DM') {
            return [createIdentificationMode('radio-info', true), createIdentificationMode('account-info')];
        } else if (tbViewParam === 'ACCTINFO') {
            return [createIdentificationMode('account-info', true), createIdentificationMode('car-info')];
        } else {
            return this._defaultIdentificationModes();
        }
    }

    getActiveLastNameField() {
        const verify = getCaseInsensitiveQueryParam(this._document.location.search, 'verify');
        return verify?.toLowerCase() === 'lastname';
    }

    getRadioIdValue() {
        const radioId = getCaseInsensitiveQueryParam(this._document.location.search, 'radioid');
        return radioId?.toUpperCase()?.trim();
    }
}
