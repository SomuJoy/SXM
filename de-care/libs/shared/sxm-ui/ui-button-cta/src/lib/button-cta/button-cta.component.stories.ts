import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiButtonCtaComponent, SxmUiButtonCtaComponentModule } from './button-cta.component';

type StoryType = SxmUiButtonCtaComponent;

export default {
    title: 'Component Library/Buttons/ButtonCtaComponent',
    component: SxmUiButtonCtaComponent,
    decorators: [
        moduleMetadata({
            imports: [SxmUiButtonCtaComponentModule],
        }),
    ],
} as Meta<SxmUiButtonCtaComponent>;

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `<button sxmUiButtonCta>Continue Text</button>`,
});

export const AsAnchor: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `<a sxmUiButtonCta>Continue Text</a>`,
});

export const ThemeFlatMatteWhite: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `
        <div style="background-color: #ebebeb; padding: 18px;">
            <button sxmUiButtonCta class="theme-flat-matte-white">Continue Text</button>
        </div>
    `,
});

export const ThemeLight: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `
        <button sxmUiButtonCta class="theme-light">Continue Text</button>
    `,
});

export const ThemeBorderOnlyLight: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `
        <div style="background-color: #666666; padding: 18px;">
            <button sxmUiButtonCta class="theme-border-only-light">Continue Text</button>
        </div>
    `,
});

export const ThemeTextOnlyLight: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `
        <div style="background-color: #666666; padding: 18px;">
            <button sxmUiButtonCta class="theme-text-only-light">Continue Text</button>
        </div>
    `,
});
