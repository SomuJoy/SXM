import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiDeviceFoundComponent } from './device-found.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

type StoryType = SxmUiDeviceFoundComponent;

export default {
    title: 'Component Library/__uncatagorized__/DeviceFoundComponent',
    component: SxmUiDeviceFoundComponent,
    decorators: [
        moduleMetadata({
            imports: [TranslateModule.forRoot()],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        }),
        withTranslation,
    ],
} as Meta<SxmUiDeviceFoundComponent>;

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `<sxm-ui-device-found></sxm-ui-device-found>`,
});
