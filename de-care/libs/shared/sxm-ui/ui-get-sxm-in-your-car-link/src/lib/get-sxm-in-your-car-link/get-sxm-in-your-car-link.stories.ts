import { SharedSxmUiUiGetSxmInYourCarLinkModule } from '../shared-sxm-ui-ui-get-sxm-in-your-car-link.module';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { MOCK_NGRX_STORE_PROVIDER } from '@de-care/shared/storybook/util-helpers';
import { GetSxmInYourCarLinkComponent } from './get-sxm-in-your-car-link.component';

const stories = storiesOf('Component Library/Links/GetSxmInYourCarLinkComponent', module).addDecorator(
    moduleMetadata({
        imports: [SharedSxmUiUiGetSxmInYourCarLinkModule],
        providers: [MOCK_NGRX_STORE_PROVIDER],
    })
);

stories.add('Default', () => ({
    component: GetSxmInYourCarLinkComponent,
    props: {
        linkData: {
            titleText: 'This is the sxm ui link',
            linkText: 'test text',
            linkURL: '/test',
        },
    },
}));
