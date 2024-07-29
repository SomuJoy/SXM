import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiPlanSelectionEnhancedComponent, SharedSxmUiUiPlanSelectionEnhancedModule } from './plan-selection-enhanced.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

type StoryType = SxmUiPlanSelectionEnhancedComponent;

export default {
    title: 'Component Library/__uncatagorized__/PlanSelectionEnhancedComponent',
    component: SxmUiPlanSelectionEnhancedComponent,
    decorators: [
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiUiPlanSelectionEnhancedModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        }),
        withTranslation,
    ],
} as Meta<SxmUiPlanSelectionEnhancedComponent>;

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `<sxm-ui-plan-selection-enhanced></sxm-ui-plan-selection-enhanced>`,
});
