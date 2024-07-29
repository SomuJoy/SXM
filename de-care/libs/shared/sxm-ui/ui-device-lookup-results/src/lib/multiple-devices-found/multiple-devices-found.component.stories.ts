import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiMultipleDevicesFoundComponent } from './multiple-devices-found.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

type StoryType = SxmUiMultipleDevicesFoundComponent;

export default {
    title: 'Component Library/__uncatagorized__/MultipleDevicesFoundComponent',
    component: SxmUiMultipleDevicesFoundComponent,
    decorators: [
        moduleMetadata({
            imports: [TranslateModule.forRoot()],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        }),
        withTranslation,
    ],
} as Meta<SxmUiMultipleDevicesFoundComponent>;

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `<sxm-ui-multiple-devices-found></sxm-ui-multiple-devices-found>`,
});
