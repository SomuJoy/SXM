import { Component, Input } from '@angular/core';

export interface Channel {
    title: string;
    descriptions: Array<string>;
}

@Component({
    selector: 'plan-description-channels',
    template: `
        <div *ngFor="let channels of channels">
            <p *ngIf="!excludeTitle" [innerHtml]="channels.title"></p>
            <ul class="checkmark-list">
                <li *ngFor="let description of channels.descriptions" data-icon="checkmark-sm">
                    <span [innerHTML]="description"></span>
                    <div class="icon-checkmark-sm-wrapper">
                        <svg class="icon icon-utility small">
                            <use class="icon-checkmark-sm" xlink:href="#icon-checkmark-sm"></use>
                        </svg>
                    </div>
                </li>
            </ul>
        </div>
    `,
    styleUrls: ['./plan-description-channels.component.scss']
})
export class PlanDescriptionChannelsComponent {
    @Input() channels: Channel[];
    @Input() excludeTitle = false;
}
