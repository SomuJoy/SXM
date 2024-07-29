import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { SharedSxmUiUiHeroModule } from '../shared-sxm-ui-ui-hero.module';

const stories = storiesOf('Component Library/ui/Hero', module)
    .addDecorator(withA11y)
    .addDecorator(
        moduleMetadata({
            imports: [SharedSxmUiUiHeroModule]
        })
    );

stories.addDecorator(withKnobs);

stories.add('long title', () => ({
    template: `
        <sxm-ui-hero [heroData]="heroData">
        </sxm-ui-hero>
    `,
    props: {
        heroData: {
            title: 'Get SiriusXM for as little as $60.00 for 12 months',
            subtitle: null,
            imageUrl: null
        }
    }
}));

stories.add('short line title', () => ({
    template: `
        <sxm-ui-hero [heroData]="heroData">
        </sxm-ui-hero>
    `,
    props: {
        heroData: {
            title: 'Before you go...',
            subtitle: null,
            imageUrl: null
        }
    }
}));

stories.add('long title with subtitle', () => ({
    template: `
        <sxm-ui-hero [heroData]="heroData">
        </sxm-ui-hero>
    `,
    props: {
        heroData: {
            title: 'Continue saving with a student plan for 12 months for $4/mo ',
            subtitle: `<p class="large-copy">But wait, there's so much more.</p>
            <p class="legal-copy">See <strong>offer details</strong> below.</p>`,
            imageUrl: null
        }
    }
}));

stories.add('short title with subtitle', () => ({
    template: `
        <sxm-ui-hero [heroData]="heroData">
        </sxm-ui-hero>
    `,
    props: {
        heroData: {
            title: 'Keep the music going now',
            subtitle: `<p class="large-copy">But hey wait, there's so much more.</p>
            <p class="legal-copy">See <strong>offer details</strong> below.</p>`,
            imageUrl: null
        }
    }
}));

//template mimics the primary package card appear beneath the hero
stories.add('host-context: bottom-padding', () => ({
    template: `
        <sxm-ui-hero class="bottom-padding" [heroData]="heroData">
        </sxm-ui-hero>
        <main _ngcontent-app-root-c171="" class="high-level-info background-offwhite">
            <section
                class="no-padding-bottom no-padding-top"
                style="position:static">
                <div class="content-container" style="position:static">
                    <div class="row align-center" style="position:static">
                        <div class="column small-12 medium-2 no-padding background-white" style="position:static"></div>
                        <div class="column small-12 medium-6 no-padding-medium background-white" style="position:static">
                            <div style="position: relative; width: 100%; height: 300px; background-color: gray; margin: auto;"></div>
                        </div>
                        <div class="column small-12 medium-2 no-padding background-white" style="position:static"></div>
                    </div>
                </div>
            </section>
        </main>
    `,
    props: {
        heroData: {
            title: 'Keep the music going for as little as $5 a month',
            subtitle: `<p class="legal-copy">See <strong>offer details</strong> below.</p>`,
            imageUrl: null
        }
    }
}));

stories.add('host-context: subtitle mobile list', () => ({
    template: `
        <sxm-ui-hero class="centered-title" [heroData]="heroData">
        </sxm-ui-hero>
    `,
    props: {
        heroData: {
            title: 'Limited time offer',
            subtitle: `<ul>
            <li>$60/mo. for 12 mo.</li>
            <li>+ FREE upgrade</strong> below.</li>
            <li>+ FREE Echo Dot</li>
            </ul>`,
            imageUrl: null
        }
    }
}));

stories.add('with image', () => ({
    template: `<sxm-ui-hero [heroData]="heroData">
    </sxm-ui-hero>`,
    props: {
        heroData: {
            title: 'Thanks for subscribing.',
            subtitle: null,
            imageUrl: 'assets/img/thanks-streaming-hero.jpg'
        }
    }
}));
