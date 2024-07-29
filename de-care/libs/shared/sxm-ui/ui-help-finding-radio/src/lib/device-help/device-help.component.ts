import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import * as uuid from 'uuid/v4';

@Component({
    selector: 'sxm-ui-device-help',
    templateUrl: './device-help.component.html',
    styleUrls: ['./device-help.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SxmUiDeviceHelpComponent implements OnInit {
    /**
     * @deprecated No longer needed for this component
     */
    @Input() isCanadaMode: boolean; // TODO: remove this and any references to it
    @Input() ariaDescribedbyTextId = uuid();

    constructor() {}

    ngOnInit() {}
}
