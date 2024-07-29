import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { TermContentModel } from './state/reducer';

@Injectable({ providedIn: 'root' })
export class TermCopyMapperService {
    constructor(@Inject(DOCUMENT) private readonly _document: Document) {}

    mapTermCopy(termContent: {
        title?: string;
        description?: string;
        showToggleLabel: string;
        hideToggleLabel: string;
        upsellDeals?: {
            name: string;
            header: string;
            deviceImage?: string;
        }[];
    }): TermContentModel {
        if (!termContent) {
            return null;
        }
        const temp = this._document.createElement('div');
        temp.innerHTML = termContent?.description;
        const firstP = temp.querySelector('p');
        if (firstP) {
            return {
                title: termContent.title,
                copy: firstP.outerHTML,
                description: termContent.description.replace(firstP.outerHTML, ''),
                toggleCollapsed: termContent.showToggleLabel,
                toggleExpanded: termContent.hideToggleLabel,
                upsellDeals: termContent.upsellDeals,
            };
        } else {
            return {
                title: termContent.title,
                copy: termContent.description,
                toggleCollapsed: termContent.showToggleLabel,
                toggleExpanded: termContent.hideToggleLabel,
                upsellDeals: termContent.upsellDeals,
            };
        }
    }
}
