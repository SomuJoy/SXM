import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'sxm-ui-listen-now-on-app',
    template: `
        <svg class="icon icon-content icon-streaming"><use xlink:href="#icon-streaming"></use></svg>
        <h5>{{ translateKeyPrefix + 'HEADLINE' | translate }}</h5>
        <p class="text-color-gray-dark listen-now-component-subhead">{{ translateKeyPrefix + 'SUB_HEADLINE' | translate }}</p>
        <sxm-ui-streaming-player-link
            [customLink]="customLink"
            [customLinkText]="translateKeyPrefix + 'LINK_TEXT' | translate"
            [isButton]="true"
        ></sxm-ui-streaming-player-link>
    `,
    styleUrls: ['./listen-now-on-app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiListenNowOnAppComponent {
    translateKeyPrefix = 'SharedSxmUiUiListenNowModule.SxmUiListenNowOnAppComponent.';
    @Input() customLink: string;
}
