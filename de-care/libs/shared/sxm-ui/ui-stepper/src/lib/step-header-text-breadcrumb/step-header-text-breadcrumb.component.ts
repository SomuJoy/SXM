import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SxmUiStepperBreadcrumbComponent } from '../stepper-breadcrumb/stepper-breadcrumb.component';

@Component({
    selector: 'sxm-ui-step-header-text-breadcrumb',
    template: `
        <header class="step-header">
            <sxm-ui-stepper-breadcrumb>
                <ng-content select="[breadcrumbText]"></ng-content>
            </sxm-ui-stepper-breadcrumb>
            <h1><ng-content select="[title]"></ng-content></h1>
            <div><ng-content select="[body]"></ng-content></div>
        </header>
    `,
    standalone: true,
    imports: [CommonModule, SxmUiStepperBreadcrumbComponent],
    styleUrls: ['./step-header-text-breadcrumb.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiStepHeaderTextBreadcrumbComponent {}
