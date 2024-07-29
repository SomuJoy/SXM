import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SxmUiTabsComponent } from './tabs/tabs.component';
import { SxmUiTabPanelComponent } from './tabs/tab-panel.component';

@NgModule({
    imports: [CommonModule],
    declarations: [SxmUiTabsComponent, SxmUiTabPanelComponent],
    exports: [SxmUiTabsComponent, SxmUiTabPanelComponent]
})
export class SharedSxmUiUiTabsModule {}
