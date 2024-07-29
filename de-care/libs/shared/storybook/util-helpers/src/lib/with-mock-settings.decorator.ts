import { makeDecorator } from '@storybook/addons';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { of } from 'rxjs';
import { DataOfferService } from '@de-care/data-services';

export const withMockSettings = makeDecorator({
    name: 'withMockSettings',
    parameterName: 'allPackageDescriptions',
    wrapper: (storyFn, context) => {
        const storyFunctionObject = storyFn(context) as any;
        if (!storyFunctionObject.moduleMetadata) {
            storyFunctionObject.moduleMetadata = {};
        }
        storyFunctionObject.moduleMetadata.providers = [
            { provide: SettingsService, useValue: { isCanadaMode: false, dateFormat: 'MM/dd/yy', settings: { country: 'us' } } },
            { provide: UserSettingsService, useValue: { isQuebec: () => false } },
            { provide: DataOfferService, useValue: { allPackageDescriptions: () => of([]) } },
            // NOTE: we aggregate in any existing providers here at the end to ensure they win (at the stories.add level)
            ...storyFunctionObject.moduleMetadata.providers,
        ];
        return storyFunctionObject;
    },
});
