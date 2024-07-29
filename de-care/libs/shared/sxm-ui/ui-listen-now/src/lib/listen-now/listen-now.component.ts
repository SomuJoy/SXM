import { Component, Input } from '@angular/core';

@Component({
    selector: 'sxm-ui-listen-now',
    templateUrl: './listen-now.component.html',
    styleUrls: ['./listen-now.component.scss'],
})
/**
 * @deprecated Use ListenNowComponent from @de-care/domains/subscriptions/ui-player-app-integration
 */
export class SxmUiListenNowComponent {
    translateKey = 'SharedSxmUiUiListenNowModule.SxmUiListenNowComponent.';

    @Input() customLink: string;
}
