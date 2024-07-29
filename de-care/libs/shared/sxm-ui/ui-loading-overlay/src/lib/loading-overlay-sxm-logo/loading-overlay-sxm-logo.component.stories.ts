import { moduleMetadata, storiesOf } from '@storybook/angular';
import { SxmUiLoadingOverlaySxmLogoComponent } from './loading-overlay-sxm-logo.component';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { TranslateModule } from '@ngx-translate/core';

const stories = storiesOf('Component Library/Overlays/SxmUiLoadingOverlaySxmLogoComponent', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [SxmUiLoadingOverlaySxmLogoComponent, TranslateModule.forRoot()],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        })
    )
    .addDecorator(withTranslation);

stories.add('Default', () => ({
    component: SxmUiLoadingOverlaySxmLogoComponent,
}));
