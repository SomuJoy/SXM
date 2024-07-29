import { APP_INITIALIZER } from '@angular/core';
import { TRANSLATE_PROVIDERS } from '@de-care/shared/storybook/util-helpers';
import { TranslateService } from '@ngx-translate/core';
import { withA11y } from '@storybook/addon-a11y';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { SharedSxmUiUiChooseGenreFormModule } from '../shared-sxm-ui-ui-choose-genre-form.module';
import { SxmUiChooseGenreFormComponent } from './choose-genre-form.component';

const options: string[] = ['SIR_AUD_CHOICE_CTRY', 'SIR_AUD_CHOICE_HH'];

const stories = storiesOf('Component Library/Forms/Full Forms/ChooseGenreForm', module)
    .addDecorator(
        moduleMetadata({
            imports: [SharedSxmUiUiChooseGenreFormModule],
            providers: [
                ...TRANSLATE_PROVIDERS,
                {
                    provide: APP_INITIALIZER,
                    useFactory: (translateService: TranslateService) => {
                        return () => {
                            translateService.setTranslation(
                                'en-US',
                                {
                                    app: {
                                        packageDescriptions: {
                                            SIR_AUD_CHOICE_CTRY: {
                                                shortName: 'Country',
                                                channels: [
                                                    {
                                                        title: 'Country channels:',
                                                        descriptions: ['Prime Country', 'The Highway', 'Y2Kountry'],
                                                    },
                                                ],
                                            },
                                            SIR_AUD_CHOICE_HH: {
                                                packageName: 'SIR_AUD_CHOICE_HH',
                                                shortName: 'Hip Hop',
                                                channels: [
                                                    {
                                                        title: 'Hip-Hop/R&B channels:',
                                                        descriptions: ['HipHopNation', 'The Heat', 'SXMFly'],
                                                    },
                                                ],
                                            },
                                        },
                                    },
                                },
                                true
                            );
                        };
                    },
                    deps: [TranslateService],
                    multi: true,
                },
            ],
        })
    )
    .addDecorator(withA11y);

stories.add('default', () => ({
    component: SxmUiChooseGenreFormComponent,
    props: {
        formOptions: options,
        defaultOptionSelected: options[0],
        stepComplete: action('@Output() stepComplete'),
    },
}));
