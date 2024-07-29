import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'sxm-ui-platform-change-message',
    template: `
        <div class="icon">
            <svg class="icon icon-utility large icon-warning">
                <use class="icon-warning" xlink:href="#icon-warning"></use>
            </svg>
        </div>
        <div>
            <p class="platform-change-info">
                <span>
                    {{ translateKeyPrefix + 'PLATFORM_CHANGE_MESSAGE_INTRO' | translate }}
                </span>
                <sxm-ui-tooltip class="tooltip-component tooltip-display-top-medium-up tooltip-display-right-large-up">
                    <span>
                        {{ translateKeyPrefix + 'PLATFORM_CHANGE_MESSAGE_TOOLTIP' | translate }}
                    </span>
                </sxm-ui-tooltip>
            </p>
            <ng-container *ngIf="'app.packageDescriptions.' + data.currentPackageName | translate | getDiffExcludedChannels: data.diffPackageName as excludedChannels">
                <ul *ngFor="let channel of excludedChannels">
                    <li *ngFor="let description of channel.descriptions">
                        <svg class="icon icon-utility large">
                            <use class="icon-x-mark-flex-stroke" xlink:href="#icon-x-mark-flex-stroke"></use>
                        </svg>
                        <span [innerHTML]="description"></span>
                    </li>
                </ul>
            </ng-container>
            <ng-content></ng-content>
        </div>
    `,
    styleUrls: ['./platform-change-message.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiPlatformChangeMessageComponent {
    translateKeyPrefix = 'DeCareUseCasesTransferFeatureACSCTargetedModule.SxmUiPlatformChangeMessageComponent.';
    @Input() data: {
        currentPackageName: string;
        diffPackageName: string;
    };
}
