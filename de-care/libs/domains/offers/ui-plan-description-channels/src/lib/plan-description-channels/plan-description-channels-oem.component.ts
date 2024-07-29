import { Component, Input } from '@angular/core';

export interface Channel {
    title: string;
    descriptions: Array<string>;
}

@Component({
    selector: 'plan-description-channels-oem',
    template: `
        <div *ngFor="let channels of channels">
            <p class="small-copy" [innerHtml]="channels.title"></p>
            <ul class="checkmark-list">
                <li class="small-copy" *ngFor="let description of channels.descriptions" data-icon="checkmark-sm">
                    <span [innerHTML]="description"></span>
                    <div class="icon-checkmark-sm-wrapper">
                        <svg class="icon icon-utility large">
                            <use class="icon-checkmark-sm" xlink:href="#icon-checkmark-sm"></use>
                        </svg>
                    </div>
                </li>
            </ul>
        </div>
    `,
})
export class PlanDescriptionChannelsOemComponent {
    @Input() channels: Channel[];
}
