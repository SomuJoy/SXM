import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';

@Component({
    selector: 'my-account-inner-strip',
    template: `<ng-content></ng-content>`,
    styleUrls: ['./inner-strip.component.scss'],
})
export class MyAccountInnerStripComponent {}

@NgModule({
    declarations: [MyAccountInnerStripComponent],
    exports: [MyAccountInnerStripComponent],
    imports: [CommonModule],
})
export class MyAccountInnerStripComponentModule {}
