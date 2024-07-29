import { Component, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

interface ListenerData {
    eyebrow?: string;
    title?: string;
    footer?: string;
    icon?: string;
}

@Component({
    selector: 'sxm-ui-listener-details',
    templateUrl: './listener-details.component.html',
    styleUrls: ['./listener-details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListenerDetailsComponent {
    @Input() listenerData: ListenerData;
}
