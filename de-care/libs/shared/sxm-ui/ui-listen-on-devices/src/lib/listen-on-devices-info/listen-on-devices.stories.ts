import { moduleMetadata, storiesOf } from '@storybook/angular';
import { MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { withA11y } from '@storybook/addon-a11y';
import { SharedSxmUiUiListenOnDevicesModule } from '../shared-sxm-ui-ui-listen-on-devices.module';

const stories = storiesOf('Component Library/Containers/ListenOnDevices', module)
    .addDecorator(
        moduleMetadata({
            imports: [SharedSxmUiUiListenOnDevicesModule],
            providers: [...TRANSLATE_PROVIDERS, MOCK_NGRX_STORE_PROVIDER],
        })
    )
    .addDecorator(withA11y)
    .addDecorator(withTranslation);

stories.add('default', () => ({
    template: `<sxm-ui-listen-on-devices-info></sxm-ui-listen-on-devices-info>`,
}));
