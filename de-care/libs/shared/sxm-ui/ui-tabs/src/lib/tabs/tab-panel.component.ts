import { Component, Input } from '@angular/core';

export interface TabInfo {
    id: string;
    qaTag: string;
    index: number;
    isSelected: boolean;
}

@Component({
    selector: 'sxm-ui-tab-panel',
    template: `
        <div role="tabpanel" class="tabs-panel" [class.is-active]="tabInfo.isSelected" id="{{ tabInfo.id }}-panel" [attr.aria-labelledby]="tabInfo.id">
            <div class="tab-content-container">
                <ng-content></ng-content>
            </div>
        </div>
    `,
    styleUrls: ['./tab-panel.component.scss'],
})
export class SxmUiTabPanelComponent {
    @Input() tabInfo: TabInfo;
    @Input() tabTitle: string;
}
