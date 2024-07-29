import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'sxm-ui-sxm-in-car-plus-streaming',
    templateUrl: 'sxm-in-car-plus-streaming.component.html',
    styleUrls: ['sxm-in-car-plus-streaming.component.scss']
})
export class SxmUiSxmInCarPlusStreamingComponent {
    @Output() sxmInCarPlusStreamingLinkClicked = new EventEmitter();
    translateKeyPrefix = 'sharedSxmUiUiSxmInCarPlusStreamingModule.sxmInCarPlusStreamingComponent';

    trackSXMInTheCarPlusStreamingLink(): void {
        this.sxmInCarPlusStreamingLinkClicked.emit();
    }
}
