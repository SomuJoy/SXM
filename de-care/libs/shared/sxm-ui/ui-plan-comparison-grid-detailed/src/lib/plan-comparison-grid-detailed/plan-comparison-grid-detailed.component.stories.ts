import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { Data, SxmUiPlanComparisonGridDetailedComponent, SxmUiPlanComparisonGridDetailedComponentModule } from './plan-comparison-grid-detailed.component';
import { TranslateModule } from '@ngx-translate/core';
import { MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { action } from '@storybook/addon-actions';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

type StoryType = SxmUiPlanComparisonGridDetailedComponent;

export default {
    title: 'Component Library/UI/Plans/PlanComparisonGridDetailedComponent',
    component: SxmUiPlanComparisonGridDetailedComponent,
    decorators: [
        moduleMetadata({
            imports: [BrowserAnimationsModule, TranslateModule.forRoot(), SxmUiPlanComparisonGridDetailedComponentModule],
            providers: [
                ...TRANSLATE_PROVIDERS,
                { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } },
                MOCK_NGRX_STORE_PROVIDER,
            ],
        }),
        withTranslation,
    ],
} as Meta<SxmUiPlanComparisonGridDetailedComponent>;

const mockData = {
    plan1: {
        packageName: 'Choose and Save',
        planCode: 'Plan1',
        channelCount: '50+',
        promoTermLength: 3,
        promoPricePerMonth: 4.99,
        pricePerMonth: 7.99,
        listenOn: {
            insideTheCar: true,
            outsideTheCar: true,
        },
        channelLineupUrl: '',
    },
    plan2: {
        packageName: 'Music Showcase',
        planCode: 'Plan2',
        channelCount: '100+',
        promoTermLength: 3,
        promoPricePerMonth: 0,
        pricePerMonth: 12.99,
        listenOn: {
            insideTheCar: true,
            outsideTheCar: true,
        },
        channelLineupUrl: '',
    },
    plan3: {
        packageName: 'Music & Entertainment',
        planCode: 'Plan3',
        channelCount: '400+',
        promoTermLength: 3,
        promoPricePerMonth: 0,
        pricePerMonth: 17.99,
        listenOn: {
            insideTheCar: true,
            outsideTheCar: true,
        },
        channelLineupUrl: '',
    },
    bestValuePlanCode: null,
    features: [
        { name: 'Ad-Free music in all genres and decades', capabilityPlan1: 'SOME', capabilityPlan2: 'ALL', capabilityPlan3: 'ALL' },
        { name: 'Artist-curated music channels', capabilityPlan1: 'NONE', capabilityPlan2: 'SOME', capabilityPlan3: 'ALL' },
        { name: 'News and politics from every angle', capabilityPlan1: 'SOME', capabilityPlan2: 'SOME', capabilityPlan3: 'ALL' },
        { name: 'Celebrity-hosted talk and comedy', capabilityPlan1: 'SOME', capabilityPlan2: 'SOME', capabilityPlan3: 'ALL' },
        { name: 'Unparalleled sports talk and analysis', capabilityPlan1: 'SOME', capabilityPlan2: 'NONE', capabilityPlan3: 'ALL' },
        { name: 'Live NHL games, NASCAR, and PGA TOUR', capabilityPlan1: 'NONE', capabilityPlan2: 'NONE', capabilityPlan3: 'ALL' },
        { name: 'Original and popular podcast series', capabilityPlan1: 'NONE', capabilityPlan2: 'NONE', capabilityPlan3: 'ALL' },
        { name: 'Exclusive SXM in-studio video', capabilityPlan1: 'NONE', capabilityPlan2: 'SOME', capabilityPlan3: 'ALL' },
    ],
} as Data;

const mockData2 = {
    plan1: {
        packageName: 'Choose and Save',
        planCode: 'Plan1',
        channelCount: '50+',
        promoTermLength: 3,
        promoPricePerMonth: 4.99,
        pricePerMonth: 7.99,
        listenOn: {
            insideTheCar: true,
            outsideTheCar: true,
        },
        channelLineupUrl: '',
    },
    plan2: {
        packageName: 'Music Showcase',
        planCode: 'Plan2',
        channelCount: '100+',
        promoTermLength: 3,
        promoPricePerMonth: 0,
        pricePerMonth: 12.99,
        listenOn: {
            insideTheCar: true,
            outsideTheCar: true,
        },
        channelLineupUrl: '',
    },

    bestValuePlanCode: null,
    features: [
        { name: 'Ad-Free music in all genres and decades', capabilityPlan1: 'SOME', capabilityPlan2: 'ALL' },
        { name: 'Artist-curated music channels', capabilityPlan1: 'NONE', capabilityPlan2: 'SOME' },
        { name: 'News and politics from every angle', capabilityPlan1: 'SOME', capabilityPlan2: 'SOME' },
        { name: 'Celebrity-hosted talk and comedy', capabilityPlan1: 'SOME', capabilityPlan2: 'SOME' },
        { name: 'Unparalleled sports talk and analysis', capabilityPlan1: 'SOME', capabilityPlan2: 'NONE' },
        { name: 'Live NHL games, NASCAR, and PGA TOUR', capabilityPlan1: 'NONE', capabilityPlan2: 'NONE' },
        { name: 'Original and popular podcast series', capabilityPlan1: 'NONE', capabilityPlan2: 'NONE' },
        { name: 'Live NHL<span>&reg;</span> games', capabilityPlan1: 'ALL', capabilityPlan2: 'NONE' },
        { name: 'Exclusive SXM in-studio video', capabilityPlan1: 'NONE', capabilityPlan2: 'SOME' },
    ],
} as Data;

const mockData3 = {
    plan1: {
        packageName: 'Platinum',
        planCode: 'Plan2',
        channelCount: '425+',
        promoTermLength: 12,
        promoPricePerMonth: 8.99,
        pricePerMonth: 12.99,
        listenOn: {
            insideTheCar: true,
            outsideTheCar: true,
        },
        channelLineupUrl: '',
    },

    bestValuePlanCode: null,
    features: [
        { name: 'Ad-Free music in all genres and decades', capabilityPlan1: 'ALL' },
        { name: 'Artist-curated music channels', capabilityPlan1: 'ALL' },
        { name: 'News and politics from every angle', capabilityPlan1: 'ALL' },
        { name: 'Celebrity-hosted talk and comedy', capabilityPlan1: 'SOME' },
        { name: 'Unparalleled sports talk and analysis', capabilityPlan1: 'SOME' },
        { name: 'Live NHL games, NASCAR, and PGA TOUR', capabilityPlan1: 'NONE' },
        { name: 'Original and popular podcast series', capabilityPlan1: 'NONE' },
        { name: 'Exclusive SXM in-studio video', capabilityPlan1: 'NONE' },
    ],
} as Data;
export const Default: Story<StoryType> = (args: StoryType) => ({
    props: {
        ...args,
        planCodeSelected: action('@Output planCodeSelected'),
        data: mockData,
    },
    template: `<sxm-ui-plan-comparison-grid-detailed [data]="data" (planCodeSelected)="planCodeSelected($event)"></sxm-ui-plan-comparison-grid-detailed>`,
});

export const WithFirstAsBestValue: Story<StoryType> = (args: StoryType) => ({
    props: {
        ...args,
        planCodeSelected: action('@Output planCodeSelected'),
        data: { ...mockData, bestValuePlanCode: 'Plan1' },
    },
    template: `<sxm-ui-plan-comparison-grid-detailed [data]="data" (planCodeSelected)="planCodeSelected($event)"></sxm-ui-plan-comparison-grid-detailed>`,
});

export const WithSecondAsBestValue: Story<StoryType> = (args: StoryType) => ({
    props: {
        ...args,
        planCodeSelected: action('@Output planCodeSelected'),
        data: { ...mockData, bestValuePlanCode: 'Plan2' },
    },
    template: `<sxm-ui-plan-comparison-grid-detailed [data]="data" (planCodeSelected)="planCodeSelected($event)"></sxm-ui-plan-comparison-grid-detailed>`,
});

export const WithThirdAsBestValue: Story<StoryType> = (args: StoryType) => ({
    props: {
        ...args,
        planCodeSelected: action('@Output planCodeSelected'),
        data: { ...mockData, bestValuePlanCode: 'Plan3' },
    },
    template: `<sxm-ui-plan-comparison-grid-detailed [data]="data" (planCodeSelected)="planCodeSelected($event)"></sxm-ui-plan-comparison-grid-detailed>`,
});

export const ColumnsWithBorders: Story<StoryType> = (args: StoryType) => ({
    props: {
        ...args,
        planCodeSelected: action('@Output planCodeSelected'),
        data: mockData,
    },
    template: `<div class="columns-with-borders"><sxm-ui-plan-comparison-grid-detailed [isExpanded]="true" [data]="data" (planCodeSelected)="planCodeSelected($event)"></sxm-ui-plan-comparison-grid-detailed></div>`,
});

export const ColumnsWithBorders2Plans: Story<StoryType> = (args: StoryType) => ({
    props: {
        ...args,
        planCodeSelected: action('@Output planCodeSelected'),
        data: mockData2,
    },
    template: `<div class="columns-with-borders"><sxm-ui-plan-comparison-grid-detailed [isExpanded]="true" [data]="data" (planCodeSelected)="planCodeSelected($event)"></sxm-ui-plan-comparison-grid-detailed></div>`,
});
export const ColumnsWithBordersOnePlan: Story<StoryType> = (args: StoryType) => ({
    props: {
        ...args,
        planCodeSelected: action('@Output planCodeSelected'),
        data: mockData3,
    },
    template: `<div class="columns-with-borders"><sxm-ui-plan-comparison-grid-detailed [isExpanded]="true" [data]="data" (planCodeSelected)="planCodeSelected($event)"></sxm-ui-plan-comparison-grid-detailed></div>`,
});
