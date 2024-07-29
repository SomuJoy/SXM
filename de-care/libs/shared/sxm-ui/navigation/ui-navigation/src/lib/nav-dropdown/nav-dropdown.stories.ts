import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { SxmUiNavDropdownModule } from './nav-dropdown.component';
import { action } from '@storybook/addon-actions';

const stories = storiesOf('Component Library/Navigation/NavDropdown', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SxmUiNavDropdownModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        })
    )
    .addDecorator(withTranslation);

stories.add('default', () => ({
    template: `
        <sxm-ui-nav-dropdown>
            <ng-container toggler><button>show</button></ng-container>
            <ng-container content>Content</ng-container>
        </sxm-ui-nav-dropdown>
    `,
    props: {},
}));
