import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiVehicleYmmInfoComponent, SxmUiVehicleYmmInfoComponentModule } from './vehicle-ymm-info.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

type StoryType = SxmUiVehicleYmmInfoComponent;

export default {
    title: 'Component Library/__uncatagorized__/VehicleYmmInfoComponent',
    component: SxmUiVehicleYmmInfoComponent,
    decorators: [
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SxmUiVehicleYmmInfoComponentModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        }),
        withTranslation,
    ],
} as Meta<SxmUiVehicleYmmInfoComponent>;

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `<sxm-ui-vehicle-ymm-info></sxm-ui-vehicle-ymm-info>`,
});
