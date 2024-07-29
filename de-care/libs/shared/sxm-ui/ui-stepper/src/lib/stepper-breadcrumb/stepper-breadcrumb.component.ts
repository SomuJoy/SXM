import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'sxm-ui-stepper-breadcrumb',
    template: ` <p class="step-header"><ng-content></ng-content></p> `,
    styleUrls: ['./stepper-breadcrumb.component.scss'],
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiStepperBreadcrumbComponent {
    @Input() text: string;
}
