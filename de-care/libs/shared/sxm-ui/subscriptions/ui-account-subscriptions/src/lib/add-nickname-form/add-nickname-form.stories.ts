import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { SharedSxmUiSubscriptionsUiAddNicknameFormModule } from './add-nickname-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';

const stories = storiesOf('Component Library/Forms/Full Forms/AddNicknameForm', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiSubscriptionsUiAddNicknameFormModule, SharedSxmUiUiModalModule],
            providers: [
                ...TRANSLATE_PROVIDERS,
                MOCK_NGRX_STORE_PROVIDER,
                { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } },
            ],
        })
    )
    .addDecorator(withTranslation);

const subData = {
    vehicle: '2021 Honda Civic',
    radioId: '990005525221',
};

stories.add('Add Nickname', () => ({
    template: `
        <sxm-ui-add-nickname-form [data]="data" (formCompleted)="onFormCompleted($event)" (cancel)="onCancel()"></sxm-ui-add-nickname-form>
    `,
    props: {
        data: subData,
        onFormCompleted: action('submit'),
        onCancel: action('cancel clicked'),
    },
}));

stories.add('Add Nickname without YMM', () => ({
    template: `
        <sxm-ui-add-nickname-form [data]="data" (formCompleted)="onFormCompleted($event)" (cancel)="onCancel()"></sxm-ui-add-nickname-form>
    `,
    props: {
        data: { ...subData, vehicle: null },
        onFormCompleted: action('submit'),
        onCancel: action('cancel clicked'),
    },
}));

stories.add('Add Nickname - loading', () => ({
    template: `
        <sxm-ui-add-nickname-form [data]="data" [loading]="true" (formCompleted)="onFormCompleted($event)" (cancel)="onCancel()"></sxm-ui-add-nickname-form>
    `,
    props: {
        data: subData,
        onFormCompleted: action('submit'),
        onCancel: action('cancel clicked'),
    },
}));

stories.add('Edit Nickname', () => ({
    template: `
        <sxm-ui-add-nickname-form [data]="data" (formCompleted)="onFormCompleted($event)" (cancel)="onCancel()"></sxm-ui-add-nickname-form>
    `,
    props: {
        data: { ...subData, nickname: 'Test-nickname' },
        onFormCompleted: action('submit'),
        onCancel: action('cancel clicked'),
    },
}));

stories.add('Add Nickname with modal', () => ({
    template: `
    <sxm-ui-modal [closed]="false"  titlePresent="true" [title]="Subscription">
        <sxm-ui-add-nickname-form [data]="data" (formCompleted)="onFormCompleted($event)" (cancel)="onCancel()"></sxm-ui-add-nickname-form>
    </sxm-ui-modal>
    `,
    props: {
        data: { ...subData, nickname: null },
        onFormCompleted: action('submit'),
        onCancel: action('cancel clicked'),
    },
}));

stories.add('Edit Nickname with modal', () => ({
    template: `
    <sxm-ui-modal [closed]="false"  titlePresent="true" [title]="Subscription">
        <sxm-ui-add-nickname-form [data]="data" (formCompleted)="onFormCompleted($event)" (cancel)="onCancel()"></sxm-ui-add-nickname-form>
    </sxm-ui-modal>
    `,
    props: {
        data: { ...subData, nickname: 'Test-nickname', vehicle: null },
        onFormCompleted: action('submit'),
        onCancel: action('cancel clicked'),
    },
}));

stories.add('Edit Nickname validation', () => ({
    template: `
    <sxm-ui-modal [closed]="false"  titlePresent="true" [title]="Subscription">
        <sxm-ui-add-nickname-form [data]="data" (formCompleted)="onFormCompleted($event)" (cancel)="onCancel()"></sxm-ui-add-nickname-form>
    </sxm-ui-modal>
    `,
    props: {
        data: { ...subData, nickname: 'Test-nickname *' },
        onFormCompleted: action('submit'),
        onCancel: action('cancel clicked'),
    },
}));
