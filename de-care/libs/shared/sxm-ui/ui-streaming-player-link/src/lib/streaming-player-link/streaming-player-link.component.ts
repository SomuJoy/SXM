import { Component, Input } from '@angular/core';

@Component({
    selector: 'sxm-ui-streaming-player-link',
    template: `
        <a
            sxmUiDataClickTrack="player"
            class="{{ isButton ? 'button primary full-width button-link' : 'text-link' }}"
            [ngClass]="customLinkClasses"
            [attr.href]="customLink || (translateKeyPrefix + 'LISTEN_NOW_LINK' | translate)"
            target="_blank"
            [attr.data-e2e]="dataE2e"
            >{{ customLinkText || (translateKeyPrefix + 'LISTEN_NOW_LINK_TEXT' | translate) }}</a
        >
    `,
})
/**
 * @deprecated Use StreamingPlayerLinkComponent from @de-care/domains/subscriptions/ui-player-app-integration
 */
export class SxmUiStreamingPlayerLinkComponent {
    @Input() dataE2e: string;

    @Input() customLinkText: string;

    @Input() customLink: string;

    @Input() customLinkClasses: string[] = [];

    @Input() isButton = false;

    readonly translateKeyPrefix = 'sharedSxmUiUiStreamingPlayerLinkModule.streamingPlayerLinkComponent.';
}
