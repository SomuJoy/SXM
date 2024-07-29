import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiPlanComparisonEnhancedGridComponent, SharedSxmUiUiPlanComparisonEnhancedGridModule } from './plan-comparison-enhanced-grid.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

type StoryType = SxmUiPlanComparisonEnhancedGridComponent;

export default {
    title: 'Component Library/__uncatagorized__/PlanComparisonEnhancedGridComponent',
    component: SxmUiPlanComparisonEnhancedGridComponent,
    decorators: [
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiUiPlanComparisonEnhancedGridModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        }),
        withTranslation,
    ],
} as Meta<SxmUiPlanComparisonEnhancedGridComponent>;

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `<sxm-ui-plan-comparison-enhanced-grid></sxm-ui-plan-comparison-enhanced-grid>`,
});
