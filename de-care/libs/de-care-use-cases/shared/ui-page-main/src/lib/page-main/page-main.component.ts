import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'main[de-care-page-main]',
    template: `
        <div class="content-container">
            <div class="row no-padding-small">
                <div class="column small-12 medium-10 offset-medium-1 align-top background-white no-padding-small">
                    <div class="main-content">
                        <ng-content></ng-content>
                    </div>
                </div>
            </div>
        </div>
    `,
    styleUrls: ['./page-main.component.scss']
})
export class PageMainComponent {
    @HostBinding('class.background-offwhite') backgroundOffWhite = true;
}
