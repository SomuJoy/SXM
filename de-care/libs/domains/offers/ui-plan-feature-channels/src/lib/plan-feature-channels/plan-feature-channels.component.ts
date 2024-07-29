import { Component, Input } from '@angular/core';

export interface Channel {
    title: string;
    descriptions: Array<string>;
}

@Component({
    selector: 'plan-feature-channels',
    template: `
        <div *ngFor="let channels of channels">
            <p *ngIf="!excludeTitle" class="bold" [innerHtml]="channels.title"></p>
            <ul class="checkmark-list">
                <li *ngFor="let feature of channels.features" data-icon="checkmark-sm">
                    <div class="checkmarks-container">
                        <span [innerHTML]="feature.name"></span>
                        <sxm-ui-tooltip class="tooltip-display-top" *ngIf="feature.tooltipText as tooltipText">
                            <p [innerHtml]="tooltipText"></p>
                        </sxm-ui-tooltip>
                    </div>
                    <div class="icon-checkmark-sm-wrapper">
                        <svg class="icon icon-utility small">
                            <use class="icon-checkmark-sm" xlink:href="#icon-checkmark-sm"></use>
                        </svg>
                    </div>
                </li>
            </ul>
        </div>
    `,
    styleUrls: ['./plan-feature-channels.component.scss']
})
export class PlanFeatureChannelsComponent {
    @Input() channels: Channel[];
    @Input() excludeTitle = false;
}
