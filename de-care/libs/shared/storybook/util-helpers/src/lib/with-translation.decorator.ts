import { addons, makeDecorator } from '@storybook/addons';
import { APP_INITIALIZER, ApplicationRef, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { select, SET as KNOB_SET_ACTION } from '@storybook/addon-knobs';

const changeLanguageKnobName = 'Change Language';

export const withTranslation = makeDecorator({
    name: 'withTranslation',
    parameterName: 'translation',
    wrapper: (storyFn, context) => {
        const channel = addons.getChannel();
        const storyFunctionObject = storyFn(context) as any;
        const translationEnabled = !storyFunctionObject.translation || (storyFunctionObject.translation && storyFunctionObject.translation.enabled !== false);
        if (storyFunctionObject.moduleMetadata && translationEnabled) {
            storyFunctionObject.props = {
                ...storyFunctionObject.props,
                __translateKnobUX: {
                    changeLanguage: select(
                        changeLanguageKnobName,
                        {
                            'English (United States)': 'en-US',
                            'English (Canada)': 'en-CA',
                            'French (Canada)': 'fr-CA',
                        },
                        context.name.includes('in Canada') ? 'en-CA' : 'en-US'
                    ),
                },
            };
            storyFunctionObject.moduleMetadata.providers = [
                ...storyFunctionObject.moduleMetadata.providers,
                {
                    provide: APP_INITIALIZER,
                    useFactory: (translateService: TranslateService, injector: Injector) => {
                        return () => {
                            if (translateService) {
                                const changeLanguageListener = ({ knobs }) => {
                                    const changeLanguageKnob = knobs[changeLanguageKnobName];
                                    if (changeLanguageKnob) {
                                        if (translateService.currentLang !== changeLanguageKnob.value) {
                                            translateService.use(changeLanguageKnob.value);
                                            const applicationRef = injector.get(ApplicationRef);
                                            if (applicationRef) {
                                                applicationRef.tick();
                                            }
                                        }
                                    }
                                };
                                const knobSetListeners = channel.listeners(KNOB_SET_ACTION);
                                if (knobSetListeners) {
                                    const listenerToRemove = channel.listeners(KNOB_SET_ACTION).find((listener) => listener.name === 'changeLanguageListener');
                                    if (listenerToRemove) {
                                        channel.removeListener(KNOB_SET_ACTION, listenerToRemove);
                                    }
                                }
                                channel.on(KNOB_SET_ACTION, changeLanguageListener);
                            }
                        };
                    },
                    deps: [TranslateService, Injector],
                    multi: true,
                },
            ];
            return storyFunctionObject;
        }
        return storyFn(context);
    },
});
