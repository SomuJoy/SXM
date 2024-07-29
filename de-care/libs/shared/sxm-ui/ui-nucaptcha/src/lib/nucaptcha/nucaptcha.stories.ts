import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { TRANSLATE_PROVIDERS, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { of } from 'rxjs';
import { NewNucaptchaWorkflowService } from '@de-care/domains/utility/state-nucaptcha';
import { SxmUiNucaptchaComponent } from './nucaptcha.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiNucaptchaModule } from '../shared-sxm-ui-ui-nucaptcha.module';
import * as newCaptchResponse from './nucaptcha-stories-new-captcha-response.json';

const stories = storiesOf('Component Library/Forms/Fields/nucaptcha', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiUiNucaptchaModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: NewNucaptchaWorkflowService, useValue: { build: () => of(newCaptchResponse.data.captcha) } }],
        })
    )
    .addDecorator(withMockSettings)
    .addDecorator(withTranslation);

stories.add('default', () => ({
    component: SxmUiNucaptchaComponent,
    props: {},
}));
