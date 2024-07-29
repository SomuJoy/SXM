import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { action } from '@storybook/addon-actions';
import { TabInfo } from './tab-panel.component';
import { SharedSxmUiUiTabsModule } from '../shared-sxm-ui-ui-tabs.module';

const stories = storiesOf('Component Library/Containers/Tabs', module)
    .addDecorator(withA11y)
    .addDecorator(moduleMetadata({ imports: [SharedSxmUiUiTabsModule] }));

stories.add('single tab', () => ({
    template: `
        <sxm-ui-tabs (tabSelected)="tabSelected($event); selectedTabId = $event.id" [ariaLabel]="ariaLabel">
            <sxm-ui-tab-panel [tabInfo]="tabInfo" tabTitle="My Tab">A single tab of content</sxm-ui-tab-panel>
        </sxm-ui-tabs>
    `,
    props: {
        ariaLabel: 'tabs-example',
        tabInfo: <TabInfo>{
            id: 'single-tab',
            qaTag: 'SingleTabLink',
            index: 0,
            isSelected: true,
        },
        tabSelected: action('@Output() tabSelected emitted'),
    },
}));

stories.add('single tab with nav hidden', () => ({
    template: `
        <sxm-ui-tabs (tabSelected)="tabSelected($event); selectedTabId = $event.id" [ariaLabel]="ariaLabel" [hideNav]="hideNav">
            <sxm-ui-tab-panel [tabInfo]="tabInfo" tabTitle="My Tab">A single tab of content</sxm-ui-tab-panel>
        </sxm-ui-tabs>
    `,
    props: {
        ariaLabel: 'tabs-example',
        hideNav: true,
        tabInfo: <TabInfo>{
            id: 'single-tab',
            qaTag: 'SingleTabLink',
            index: 0,
            isSelected: true,
        },
        tabSelected: action('@Output() tabSelected emitted'),
    },
}));

stories.add('multiple tabs', () => ({
    template: `
        <sxm-ui-tabs (tabSelected)="tabSelected($event);" [ariaLabel]="ariaLabel">
            <sxm-ui-tab-panel [tabInfo]="tabInfo1" tabTitle="First Tab">First tab of content</sxm-ui-tab-panel>
            <sxm-ui-tab-panel [tabInfo]="tabInfo2" tabTitle="Second Tab">Second tab of content</sxm-ui-tab-panel>
        </sxm-ui-tabs>
    `,
    props: {
        ariaLabel: 'tabs-example',
        tabInfo1: <TabInfo>{
            id: 'first-tab',
            qaTag: 'FirstTabLink',
            index: 0,
            isSelected: true,
        },
        tabInfo2: <TabInfo>{
            id: 'second-tab',
            qaTag: 'SecondTabLink',
            index: 1,
            isSelected: false,
        },
        tabSelected: action('@Output() tabSelected emitted'),
    },
}));

stories.add('multiple tabs second selected', () => ({
    template: `
        <sxm-ui-tabs (tabSelected)="tabSelected($event);" [ariaLabel]="ariaLabel">
            <sxm-ui-tab-panel [tabInfo]="tabInfo1" tabTitle="First Tab">First tab of content</sxm-ui-tab-panel>
            <sxm-ui-tab-panel [tabInfo]="tabInfo2" tabTitle="Second Tab">Second tab of content</sxm-ui-tab-panel>
        </sxm-ui-tabs>
    `,
    props: {
        ariaLabel: 'tabs-example',
        tabInfo1: <TabInfo>{
            id: 'first-tab',
            qaTag: 'FirstTabLink',
            index: 0,
            isSelected: false,
        },
        tabInfo2: <TabInfo>{
            id: 'second-tab',
            qaTag: 'SecondTabLink',
            index: 1,
            isSelected: true,
        },
        tabSelected: action('@Output() tabSelected emitted'),
    },
}));

stories.add('multiple tabs none selected', () => ({
    template: `
        <sxm-ui-tabs (tabSelected)="tabSelected($event);" [ariaLabel]="ariaLabel">
            <sxm-ui-tab-panel [tabInfo]="tabInfo1" tabTitle="First Tab">First tab of content</sxm-ui-tab-panel>
            <sxm-ui-tab-panel [tabInfo]="tabInfo2" tabTitle="Second Tab">Second tab of content</sxm-ui-tab-panel>
        </sxm-ui-tabs>
    `,
    props: {
        ariaLabel: 'tabs-example',
        tabInfo1: <TabInfo>{
            id: 'first-tab',
            qaTag: 'FirstTabLink',
            index: 0,
            isSelected: false,
        },
        tabInfo2: <TabInfo>{
            id: 'second-tab',
            qaTag: 'SecondTabLink',
            index: 1,
            isSelected: false,
        },
        tabSelected: action('@Output() tabSelected emitted'),
    },
}));

stories.add('multiple tabs custom order', () => ({
    template: `
        <sxm-ui-tabs (tabSelected)="tabSelected($event);" [ariaLabel]="ariaLabel">
            <sxm-ui-tab-panel [tabInfo]="tabInfo1" tabTitle="Tab A">Tab A of content</sxm-ui-tab-panel>
            <sxm-ui-tab-panel [tabInfo]="tabInfo2" tabTitle="Tab B">Tab B of content</sxm-ui-tab-panel>
            <sxm-ui-tab-panel [tabInfo]="tabInfo3" tabTitle="Tab C">Tab C of content</sxm-ui-tab-panel>
        </sxm-ui-tabs>
    `,
    props: {
        ariaLabel: 'tabs-example',
        tabInfo1: <TabInfo>{
            id: 'tab-a',
            qaTag: 'TabALink',
            index: 1,
            isSelected: false,
        },
        tabInfo2: <TabInfo>{
            id: 'tab-b',
            qaTag: 'TabBLink',
            index: 2,
            isSelected: false,
        },
        tabInfo3: <TabInfo>{
            id: 'tab-c',
            qaTag: 'TabCLink',
            index: 0,
            isSelected: true,
        },
        tabSelected: action('@Output() tabSelected emitted'),
    },
}));

stories.add('two sets on the same page', () => ({
    template: `
        <sxm-ui-tabs (tabSelected)="tabSelected($event);" [ariaLabel]="ariaLabel">
            <sxm-ui-tab-panel [tabInfo]="tabInfo1" tabTitle="First Tab">First tab of content</sxm-ui-tab-panel>
            <sxm-ui-tab-panel [tabInfo]="tabInfo2" tabTitle="Second Tab">Second tab of content</sxm-ui-tab-panel>
        </sxm-ui-tabs>
        <sxm-ui-tabs (tabSelected)="tabSelected($event);" [ariaLabel]="ariaLabel">
            <sxm-ui-tab-panel [tabInfo]="tabInfo3" tabTitle="Tab A">Tab A of content</sxm-ui-tab-panel>
            <sxm-ui-tab-panel [tabInfo]="tabInfo4" tabTitle="Tab B">Tab B of content</sxm-ui-tab-panel>
        </sxm-ui-tabs>
    `,
    props: {
        ariaLabel1: 'tabs1-example',
        tabInfo1: <TabInfo>{
            id: 'first-tab',
            qaTag: 'FirstTabLink',
            index: 0,
            isSelected: true,
        },
        tabInfo2: <TabInfo>{
            id: 'second-tab',
            qaTag: 'SecondTabLink',
            index: 1,
            isSelected: false,
        },
        ariaLabel2: 'tabs2-example',
        tabInfo3: <TabInfo>{
            id: 'tab-a',
            qaTag: 'TabALink',
            index: 0,
            isSelected: true,
        },
        tabInfo4: <TabInfo>{
            id: 'tab-b',
            qaTag: 'TabBLink',
            index: 1,
            isSelected: false,
        },
        tabSelected: action('@Output() tabSelected emitted'),
    },
}));
