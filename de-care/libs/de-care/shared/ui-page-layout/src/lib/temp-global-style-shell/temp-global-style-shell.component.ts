import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'de-care-temp-global-style-shell',
    template: `
        <link rel="stylesheet" href="/assets/sxm.min.css" />
        <router-outlet></router-outlet>
    `,
})
export class TempGlobalStyleShellComponent {}

@NgModule({
    imports: [RouterModule],
    declarations: [TempGlobalStyleShellComponent],
    exports: [TempGlobalStyleShellComponent],
})
export class TempGlobalStyleShellComponentModule {}
