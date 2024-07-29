import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { ElementsModule } from '../elements.module';
import { withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { MOCK_DATA_LAYER_PROVIDER, TRANSLATE_PROVIDERS } from '@de-care/shared/storybook/util-helpers';
import { DataTrackerService } from '@de-care/shared/data-tracker';

const stories = storiesOf('Elements/RFLZ loader widget', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [ElementsModule],
            providers: [MOCK_DATA_LAYER_PROVIDER, TRANSLATE_PROVIDERS, { provide: DataTrackerService, useValue: '' }],
        })
    )
    .addDecorator(withMockSettings)
    .addDecorator(withTranslation);

stories.add('default', () => ({
    template: `
            <sxm-rflz-widget-loader>
            </sxm-rflz-widget-loader>
        `,
    props: {},
}));
