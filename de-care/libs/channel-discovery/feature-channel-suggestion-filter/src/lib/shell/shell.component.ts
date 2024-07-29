import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedSxmUiUiIconLogoModule } from '@de-care/shared/sxm-ui/ui-icon-logo';

@Component({
    selector: 'sxmcd-shell',
    template: `
        <header>
            <mat-icon svgIcon="logo"></mat-icon>
        </header>
        <main>
            <router-outlet></router-outlet>
        </main>
    `,
    styleUrls: ['./shell.component.scss'],
    standalone: true,
    imports: [RouterModule, SharedSxmUiUiIconLogoModule],
})
export class ShellComponent {}
