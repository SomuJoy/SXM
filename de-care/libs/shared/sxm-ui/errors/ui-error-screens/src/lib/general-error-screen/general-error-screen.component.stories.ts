import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiGeneralErrorScreenComponent, SxmUiGeneralErrorScreenComponentModule } from './general-error-screen.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

type StoryType = SxmUiGeneralErrorScreenComponent;

export default {
    title: 'Component Library/Errors/GeneralErrorScreenComponent',
    component: SxmUiGeneralErrorScreenComponent,
    decorators: [
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SxmUiGeneralErrorScreenComponentModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        }),
        withTranslation,
    ],
} as Meta<SxmUiGeneralErrorScreenComponent>;

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `
        <sxm-ui-general-error-screen>
            <ng-container getHelpCta>
                <a>Chat with an agent</a> or call 888-888-8888
            </ng-container>
        </sxm-ui-general-error-screen>
    `,
});
