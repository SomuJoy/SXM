import { AfterContentChecked, Component, ContentChildren, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { SxmUiTabPanelComponent, TabInfo } from './tab-panel.component';
import { Store } from '@ngrx/store';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';

interface TabInfoWithTitle extends TabInfo {
    title: string;
}

@Component({
    selector: 'sxm-ui-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss'],
})
export class SxmUiTabsComponent implements AfterContentChecked {
    @Input() ariaLabel: string;
    @Input() hideNav = false;
    @Output() tabSelected = new EventEmitter<TabInfo>();
    @ContentChildren(SxmUiTabPanelComponent) tabPanels: QueryList<SxmUiTabPanelComponent>;
    @ViewChildren('tabButton') tabButtons: QueryList<ElementRef>;
    tabInfos: TabInfoWithTitle[];
    private _previousTabInfosSerialized: string = null;
    private _focusIndex: number;

    constructor(private readonly _store: Store) {}
    ngAfterContentChecked(): void {
        this._mapTabInfosIfNeeded();
    }

    selectTab(tabInfo: TabInfo): void {
        this.tabPanels.forEach((tabPanel) => {
            tabPanel.tabInfo = {
                ...tabPanel.tabInfo,
                isSelected: tabPanel.tabInfo.id === tabInfo.id,
            };
        });
        this.tabSelected.emit(tabInfo);
    }

    onKeydown(key: KeyboardEvent): void {
        switch (key.code) {
            case 'ArrowLeft': {
                this._focusPrevTab();
                break;
            }
            case 'ArrowRight': {
                this._focusNextTab();
                break;
            }
            case 'Home': {
                key.preventDefault();
                this._focusFirstTab();
                break;
            }
            case 'End': {
                key.preventDefault();
                this._focusLastTab();
                break;
            }
        }
    }

    onTabFocus(tabInfo): void {
        this._focusIndex = tabInfo.index;
    }

    onTablistFocus(): void {
        this._focusIndex = null;
    }

    private _mapTabInfosIfNeeded(): void {
        const tabInfos = this.tabPanels.map(tabPanelToTabInfoWithTitle);
        const current = JSON.stringify(tabInfos);
        if (this._previousTabInfosSerialized !== current) {
            this._previousTabInfosSerialized = current;
            this.tabInfos = tabInfos.sort(sortTabInfosByIndex);
        }
    }

    private _focusPrevTab(): void {
        // currIndex is either the currently focused index or it's the selected tab
        const currIndex = this._focusIndex !== null ? this._focusIndex : this.tabInfos.find((info) => info.isSelected)?.index;
        if (currIndex === 0) {
            this.tabButtons.toArray()?.[this.tabInfos.length - 1]?.nativeElement?.focus();
        } else {
            this.tabButtons.toArray()?.[currIndex - 1]?.nativeElement?.focus();
        }
    }

    private _focusNextTab(): void {
        // currIndex is either the currently focused index or it's the selected tab
        const currIndex = this._focusIndex !== null ? this._focusIndex : this.tabInfos.find((info) => info.isSelected)?.index;
        if (currIndex === this.tabInfos.length - 1) {
            this.tabButtons.toArray()?.[0]?.nativeElement?.focus();
        } else {
            this.tabButtons.toArray()?.[currIndex + 1]?.nativeElement?.focus();
        }
    }

    private _focusFirstTab(): void {
        this.tabButtons.toArray()?.[0]?.nativeElement?.focus();
    }

    private _focusLastTab(): void {
        this.tabButtons.toArray()?.[this.tabInfos.length - 1]?.nativeElement?.focus();
    }
}

function tabPanelToTabInfoWithTitle(tabPanel: SxmUiTabPanelComponent): TabInfoWithTitle {
    return { ...tabPanel.tabInfo, title: tabPanel.tabTitle };
}

function sortTabInfosByIndex(a: TabInfo, b: TabInfo): number {
    return a.index > b.index ? 1 : a.index < b.index ? -1 : 0;
}
