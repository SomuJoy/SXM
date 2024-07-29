import { Component } from '@angular/core';

@Component({
    /*
    Usage example:

        <main deCarePageMainContent></main>
     */
    selector: '[deCarePageMainContent]',
    template: `<ng-content></ng-content>`,
    styleUrls: ['./page-main-content.component.scss'],
})
export class PageMainContentComponent {}
