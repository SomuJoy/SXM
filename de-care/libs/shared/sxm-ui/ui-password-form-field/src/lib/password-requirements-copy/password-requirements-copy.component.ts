import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'sxm-ui-password-requirements-copy',
    template: `<p [innerHTML]="translateKeyPrefix + 'REQUIREMENTS_COPY' | translate"></p>`,
    styleUrls: ['./password-requirements-copy.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiPasswordRequirementsCopyComponent {
    translateKeyPrefix = 'sharedSxmUiUiPasswordFormFieldModule.SxmUiPasswordRequirementsCopyComponent.';
}
