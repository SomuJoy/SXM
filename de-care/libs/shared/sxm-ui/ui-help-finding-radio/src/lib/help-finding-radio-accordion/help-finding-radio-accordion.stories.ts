import { boolean, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { SxmUiHelpFindingRadioAccordionComponent } from './help-finding-radio-accordion.component';
import { withTranslation, TRANSLATE_PROVIDERS } from '@de-care/shared/storybook/util-helpers';
import { SharedSxmUiUiHelpFindingRadioModule } from '../shared-sxm-ui-ui-help-finding-radio.module';

const stories = storiesOf('Component Library/ui/SxmUiHelpFindingRadioComponent', module)
    .addDecorator(withA11y)
    .addDecorator(withTranslation)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [SharedSxmUiUiHelpFindingRadioModule],
            providers: [...TRANSLATE_PROVIDERS]
        })
    );

stories.add('default', () => ({
    component: SxmUiHelpFindingRadioAccordionComponent,
    props: {
        showDontHaveRadio: boolean('@Input showDontHaveRadio', false),
        deviceHelp: action('@Output() deviceHelp emitted')
    }
}));
