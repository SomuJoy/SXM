import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { NavLinks, SxmUiNavWithUserPresenceModule } from './nav-with-user-presence.component';

const stories = storiesOf('Component Library/Navigation/NavWithUserPresence', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SxmUiNavWithUserPresenceModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        })
    )
    .addDecorator(withTranslation);

const links: NavLinks[] = [
    { url: '#dashboard', text: 'Dashboard', altText: 'go to my dashboard' },
    { url: '#subscriptions', text: 'Subscriptions', altText: 'view my subscriptions' },
    { url: '#billing', text: 'Billing', altText: 'go to my billing info' },
    { url: '#profile', text: 'Profile', altText: 'manage my profile' },
    { url: '#notifications', text: 'Notifications', altText: 'see account notifications' },
];

stories.add('default', () => ({
    template: `
        <sxm-ui-nav-with-user-presence [name]="name" [accountNumber]="accountNumber" [links]="links"></sxm-ui-nav-with-user-presence>
    `,
    props: {
        name: 'Penelope',
        accountNumber: '445514076213',
        links,
    },
}));
