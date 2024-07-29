import { Component } from '@angular/core';

@Component({
    selector: 'important-info',
    template: `
        <p class="legal-copy" [innerHTML]="'offers.importantInfoComponent.BODY' | translate"></p>
    `
})
export class ImportantInfoComponent {}
