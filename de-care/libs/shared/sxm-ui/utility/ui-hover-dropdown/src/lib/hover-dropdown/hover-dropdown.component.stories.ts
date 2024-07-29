import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiHoverDropdownComponent, SxmUiHoverDropdownComponentModule } from './hover-dropdown.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

type StoryType = SxmUiHoverDropdownComponent;

export default {
    title: 'Component Library/Utility/HoverDropdownComponent',
    component: SxmUiHoverDropdownComponent,
    decorators: [
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SxmUiHoverDropdownComponentModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        }),
        withTranslation,
    ],
} as Meta<SxmUiHoverDropdownComponent>;

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `
    <style>
        .storybook-height {
            min-height: 200px;
        }
        sxm-ui-hover-dropdown {
            --dropdown-margin-top: 4px;
        }
        p {
            padding-top: 20px;
        }
        ul {
            list-style: none;
            background: lightblue;
            padding: 8px 8px 8px 16px;
            margin: 0;
            li {
                padding: 4px;
            }
        }
    </style>
    <div class="storybook-height">
        <sxm-ui-hover-dropdown>
            <ng-container hover>
                <p>hover to show dropdown</p>
            </ng-container>
            <ng-container content>
                <ul role="menu">
                    <li><button>navigation link 1</button></li>
                    <li><button>nav 2</button></li>
                </ul>
            </ng-container>
        </sxm-ui-hover-dropdown>
    </div>
    `,
});

export const EditedLeftAndWidth: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `
    <style>
        .storybook-height {
            min-height: 200px;
        }
        sxm-ui-hover-dropdown {
            --dropdown-margin-top: 10px;
            --content-left: 0;
            --content-width: 100%;
        }
        p {
            padding-top: 20px;
        }
        ul {
            list-style: none;
            background: lightblue;
            padding: 8px 8px 8px 16px;
            margin: 0;
            li {
                padding: 4px;
            }
        }
    </style>
    <div class="storybook-height">
        <sxm-ui-hover-dropdown>
            <ng-container hover>
                <p>hover to show dropdown</p>
            </ng-container>
            <ng-container content>
                <ul role="menu">
                    <li><button>navigation link 1</button></li>
                    <li><button>nav 2</button></li>
                </ul>
            </ng-container>
        </sxm-ui-hover-dropdown>
    </div>
    `,
});
