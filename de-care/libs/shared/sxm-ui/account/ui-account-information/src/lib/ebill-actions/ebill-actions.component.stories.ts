import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiEBillActionsComponent, SharedSxmUiEBillActionsComponentModule } from './ebill-actions.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { RouterTestingModule } from '@angular/router/testing';

type StoryType = SxmUiEBillActionsComponent;

export default {
    title: 'Component Library/Account/EBillActionsComponent',
    component: SxmUiEBillActionsComponent,
    decorators: [
        moduleMetadata({
            imports: [TranslateModule.forRoot(),RouterTestingModule, SharedSxmUiEBillActionsComponentModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        }),
        withTranslation,
    ],
} as Meta<SxmUiEBillActionsComponent>;

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: {
         ...args, 
         email: 'testmailaddress@siriusxm.com', 
         dropdownListData: [
            {
              "label": "Change email",
              "modalId": "updateEmail",
              "routerLinkObject": [
                {
                  "outlets": {
                    "modal": [
                      "updateEmail"
                    ]
                  }
                }
              ]
            },
            {
              "label": "Switch to paper invoice",
              "modalId": "optOut",
              "routerLinkObject": [
                {
                  "outlets": {
                    "modal": [
                      "optOut"
                    ]
                  }
                }
              ]
            }
          ] 
        },
    template: `<sxm-ui-ebill-actions [email]="email" [dropdownListData]="dropdownListData"></sxm-ui-ebill-actions>`,
});
