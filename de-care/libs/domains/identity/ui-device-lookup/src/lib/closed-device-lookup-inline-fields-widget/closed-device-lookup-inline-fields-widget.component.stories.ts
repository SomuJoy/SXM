import { moduleMetadata, Story, Meta } from '@storybook/angular';
import {
    SxmUiClosedDeviceLookupInlineFieldsWidgetComponent,
    SxmUiClosedDeviceLookupInlineFieldsWidgetComponentModule,
} from './closed-device-lookup-inline-fields-widget.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

type StoryType = SxmUiClosedDeviceLookupInlineFieldsWidgetComponent;

export default {
    title: 'Component Library/__uncatagorized__/ClosedDeviceLookupInlineFieldsWidgetComponent',
    component: SxmUiClosedDeviceLookupInlineFieldsWidgetComponent,
    decorators: [
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SxmUiClosedDeviceLookupInlineFieldsWidgetComponentModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        }),
        withTranslation,
    ],
} as Meta<SxmUiClosedDeviceLookupInlineFieldsWidgetComponent>;

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `<sxm-ui-closed-device-lookup-inline-fields-widget></sxm-ui-closed-device-lookup-inline-fields-widget>`,
});
