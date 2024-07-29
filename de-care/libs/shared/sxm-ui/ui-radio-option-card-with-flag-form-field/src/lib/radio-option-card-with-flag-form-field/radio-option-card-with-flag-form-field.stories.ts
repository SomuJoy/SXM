import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiRadioOptionCardWithFlagFormFieldModule } from '../shared-sxm-ui-ui-radio-option-card-with-flag-form-field.module';
import { HttpClientModule } from '@angular/common/http';
import { UserSettingsService, AppSettings } from '@de-care/settings';
import { of } from 'rxjs';
import { withMockSettings, withTranslation, TRANSLATE_PROVIDERS, MOCK_ALL_PACKAGE_DESC } from '@de-care/shared/storybook/util-helpers';
import { DataOfferService } from '@de-care/data-services';

const stories = storiesOf('Component Library/Forms/Fields/RadioOptionCardWithFlagFormField', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [ReactiveFormsModule, HttpClientModule, SharedSxmUiUiRadioOptionCardWithFlagFormFieldModule],
            providers: [
                ...TRANSLATE_PROVIDERS,
                {
                    provide: UserSettingsService,
                    useValue: {
                        dateFormat$: of('MM/dd/yy'),
                    },
                },
                {
                    provide: AppSettings,
                    useValue: { country: 'ca' },
                },
                { provide: DataOfferService, useValue: { ...MOCK_ALL_PACKAGE_DESC, customer: () => of({}) } },
            ],
        })
    )
    .addDecorator(withMockSettings)
    .addDecorator(withTranslation);

const radioOption = {
    username: 'ttm******@siriusxm.com',
    nextCycleOn: new Date('2024-07-05T00:00:00-07:00'),
    vehicleInfo: {
        year: '2015',
        make: 'Volkswagen',
        model: 'Golf',
    },
    packageName: 'SXM_SIR_AUD_ALLACCESS',
    radioId: '10000218038',
    termLength: 12,
};

const radioOption1 = {
    username: 'xxn******@siriusxm.com',
    nextCycleOn: new Date('2022-04-01T00:00:00-04:00'),
    vehicleInfo: {
        year: null,
        make: null,
        model: null,
    },
    packageName: 'SXM_SIR_AUD_ALLACCESS',
    radioId: '10000218038',
    termLength: 6,
};

stories.add('default', () => ({
    template: `<form style = "padding:40px"  [formGroup]="form" (ngSubmit)="onSubmit(form.value.option)">
                <div>
                    <sxm-ui-radio-option-card-with-flag-form-field
                    [formGroup] = "form.get('option')"
                    radioName  = "radio"
                    [radioOption] = "radioOption"
                    value = "10000217014"
                    flagName  = "checkbox"
                    [hasFooter] = "true"
                    >
                    </sxm-ui-radio-option-card-with-flag-form-field>
                    <sxm-ui-radio-option-card-with-flag-form-field
                    [formGroup] = "form.get('option')"
                    radioName  = "radio"
                    [radioOption] = "radioOption1"
                    value = "10000218849"
                    flagName  = "checkbox"
                    [selectable] = "false">
                    </sxm-ui-radio-option-card-with-flag-form-field>
                </div>
                <div>
                    {{ form.value | json }}
                </div>
               </form>`,
    styles: [
        `
        form{
            margin: 30px auto;
            max-width:400px;
        }
        .body{
            padding: 20px 12px;
        }
        `,
    ],
    props: {
        form: new FormGroup({
            option: new FormGroup({
                radio: new FormControl(),
                checkbox: new FormControl(),
            }),
        }),
        radioOption,
        radioOption1,
    },
}));
