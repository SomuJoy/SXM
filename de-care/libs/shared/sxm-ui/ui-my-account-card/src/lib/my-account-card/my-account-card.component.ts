import { Component } from '@angular/core';

@Component({
    selector: 'sxm-ui-my-account-card',
    template: `
        <div class="inner-padding"><ng-content select="[body]"></ng-content></div>
        <ng-content select="[footer]"></ng-content>
    `,
    styleUrls: ['./my-account-card.component.scss'],
})
export class SxmUiMyAccountCardComponent {}
