import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiVehicleYmmInfoWithEditCtaComponent, SxmUiVehicleYmmInfoWithEditCtaComponentModule } from './vehicle-ymm-info-with-edit-cta.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

type StoryType = SxmUiVehicleYmmInfoWithEditCtaComponent;

export default {
    title: 'Component Library/__uncatagorized__/VehicleYmmInfoWithEditCtaComponent',
    component: SxmUiVehicleYmmInfoWithEditCtaComponent,
    decorators: [
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SxmUiVehicleYmmInfoWithEditCtaComponentModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        }),
        withTranslation,
    ],
} as Meta<SxmUiVehicleYmmInfoWithEditCtaComponent>;

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `<sxm-ui-vehicle-ymm-info-with-edit-cta></sxm-ui-vehicle-ymm-info-with-edit-cta>`,
});
