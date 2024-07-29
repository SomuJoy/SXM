import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiSesssionTimeoutComponent } from './sesssion-timeout.component';
import { TranslateModule } from '@ngx-translate/core';
import { MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { SharedSxmUiUiSessionTimeoutModule } from '../shared-sxm-ui-ui-session-timeout.module';
import { RouterTestingModule } from '@angular/router/testing';

type StoryType = SxmUiSesssionTimeoutComponent;

export default {
    title: 'Component Library/UI/SesssionTimeoutComponent',
    decorators: [
        moduleMetadata({
            imports: [RouterTestingModule, TranslateModule.forRoot({ useDefaultLang: false }), SharedSxmUiUiSessionTimeoutModule],
            providers: [
                ...TRANSLATE_PROVIDERS,
                { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } },
                MOCK_NGRX_STORE_PROVIDER,
            ],
        }),
        withTranslation,
    ],
} as Meta<SxmUiSesssionTimeoutComponent>;

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `<sxm-ui-sesssion-timeout></sxm-ui-sesssion-timeout>`,
});
