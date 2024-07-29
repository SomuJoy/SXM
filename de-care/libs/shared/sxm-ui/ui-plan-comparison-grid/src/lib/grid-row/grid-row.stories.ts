import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs, number } from '@storybook/addon-knobs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedSxmUiUiPlanComparisonGridModule } from '../plan-comparison-grid/plan-comparison-grid.component';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { TranslateModule } from '@ngx-translate/core';

const channelsRowData = {
    title: 'Channels Included',
    tooltip: null,
    columns: [{ label: '50+' }, { label: '325+' }, { label: '350+' }],
    selectedIndex: 0,
};

const checkmarksRowData = {
    title: 'Original Talk',
    tooltip: 'Celebrity-hosted talk channels, comedy, and news',
    columns: [
        { label: null, checkmark: false, itemName: 'SiriusXM Music Showcase' },
        { label: null, checkmark: true, itemName: 'SiriusXM Music & Entertainment' },
        { label: null, checkmark: true, itemName: 'SiriusXM Platinum' },
    ],
    selectedIndex: 0,
};

const linksRowData = {
    title: 'Channel Lineup',
    tooltip: 'Inside and outside the car lineups vary slightly. Other fees and taxes may apply.',
    columns: [
        { label: 'View Lineup', linkUrl: 'https://www.siriusxm.com/choicechguide' },
        { label: 'View Lineup', linkUrl: 'https://www.siriusxm.com/channels/guide?package=SIR_AUD_EVT&upsell=false' },
        { label: 'View Lineup', linkUrl: 'https://www.siriusxm.com/channels/guide?package=SIR_AUD_ALLACCESS&upsell=false' },
    ],
    selectedIndex: 0,
};

const stories = storiesOf('shared/sxm-ui/plan-comparison-grid/grid-row', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [BrowserAnimationsModule, SharedSxmUiUiPlanComparisonGridModule, TranslateModule.forRoot()],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        })
    )
    .addDecorator(withTranslation);

stories.add('Row with Labels', () => ({
    template: '<sxm-ui-grid-row [gridRowVM]="gridRowVM" [selectedIndex]="selectedIndex"></sxm-ui-grid-row>',
    props: {
        gridRowVM: channelsRowData,
        selectedIndex: number('@Input selectedIndex', 0, { min: 0, max: channelsRowData.columns.length - 1, range: false }),
    },
}));

stories.add('Row with Checkmarks', () => ({
    template: '<sxm-ui-grid-row [gridRowVM]="gridRowVM" [selectedIndex]="selectedIndex"></sxm-ui-grid-row>',
    props: {
        gridRowVM: checkmarksRowData,
        selectedIndex: number('@Input selectedIndex', 0, { min: 0, max: channelsRowData.columns.length - 1, range: false }),
    },
}));

stories.add('Row with Links', () => ({
    template: '<sxm-ui-grid-row [gridRowVM]="gridRowVM" [selectedIndex]="selectedIndex"></sxm-ui-grid-row>',
    props: {
        gridRowVM: linksRowData,
        selectedIndex: number('@Input selectedIndex', 0, { min: 0, max: channelsRowData.columns.length - 1, range: false }),
    },
}));
