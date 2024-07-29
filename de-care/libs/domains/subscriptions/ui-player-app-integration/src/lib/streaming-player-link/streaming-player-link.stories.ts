import { storiesOf, moduleMetadata } from '@storybook/angular';
import { DomainsSubscriptionsUiPlayerAppIntegrationModule } from '../domains-subscriptions-ui-player-app-integration.module';
// eslint-disable-next-line
import { TRANSLATE_PROVIDERS, MOCK_NGRX_STORE_PROVIDER, withTranslation } from '../../../../../../shared/storybook/util-helpers/src';
import { GenerateTokenForSubscriptionWorkflowService } from '@de-care/domains/subscriptions/state-player-app-tokens';
import { of, timer, throwError } from 'rxjs';
import { map, mapTo, delay, switchMap } from 'rxjs/operators';

const stories = storiesOf('Component Library/Molecules/Streaming Player Link', module)
    .addDecorator(
        moduleMetadata({
            imports: [DomainsSubscriptionsUiPlayerAppIntegrationModule],
            providers: [...TRANSLATE_PROVIDERS, MOCK_NGRX_STORE_PROVIDER, { provide: GenerateTokenForSubscriptionWorkflowService, useValue: { build: () => of(null) } }],
        })
    )
    .addDecorator(withTranslation);

stories.add('default', () => ({
    template: `<streaming-player-link></streaming-player-link>`,
}));
stories.add('as button', () => ({
    template: `<streaming-player-link [isButton]="true"></streaming-player-link>`,
}));
stories.add('with custom link text', () => ({
    template: `<streaming-player-link customLinkText="custom link text"></streaming-player-link>`,
}));
stories.add('with custom link URL', () => ({
    template: `<streaming-player-link customLink="https://player.siriusxm.com"></streaming-player-link>`,
}));

const mockInfoForToken = { subscriptionId: '123', useCase: 'test' };
const mockPlayerTokenData = { token: 'abc', url: 'https://link-orch.sit05.idm.siriusxm.com/' };
const mockPlayerTokenWorkflow = { build: () => of(mockPlayerTokenData) };
stories.add('using token', () => ({
    template: `<streaming-player-link [infoForToken]="mockInfoForToken"></streaming-player-link>`,
    moduleMetadata: {
        providers: [{ provide: GenerateTokenForSubscriptionWorkflowService, useValue: mockPlayerTokenWorkflow }],
    },
    props: { mockInfoForToken },
}));
stories.add('using token as button', () => ({
    template: `<streaming-player-link [infoForToken]="mockInfoForToken" [isButton]="true"></streaming-player-link>`,
    moduleMetadata: {
        providers: [{ provide: GenerateTokenForSubscriptionWorkflowService, useValue: mockPlayerTokenWorkflow }],
    },
    props: { mockInfoForToken },
}));

const mockPlayerTokenWorkflowWithDelay = { build: () => timer(3000).pipe(map(() => mockPlayerTokenData)) };
stories.add('using token with processing delay', () => ({
    template: `<streaming-player-link [infoForToken]="mockInfoForToken"></streaming-player-link>`,
    moduleMetadata: {
        providers: [{ provide: GenerateTokenForSubscriptionWorkflowService, useValue: mockPlayerTokenWorkflowWithDelay }],
    },
    props: { mockInfoForToken },
}));
stories.add('using token as button with processing delay', () => ({
    template: `<streaming-player-link [infoForToken]="mockInfoForToken" [isButton]="true"></streaming-player-link>`,
    moduleMetadata: {
        providers: [{ provide: GenerateTokenForSubscriptionWorkflowService, useValue: mockPlayerTokenWorkflowWithDelay }],
    },
    props: { mockInfoForToken },
}));

stories.add('using token as button with fallback to link on token failure', () => ({
    template: `<streaming-player-link [infoForToken]="mockInfoForToken" [isButton]="true"></streaming-player-link>`,
    moduleMetadata: {
        providers: [{ provide: GenerateTokenForSubscriptionWorkflowService, useValue: { build: () => throwError('error') } }],
    },
    props: { mockInfoForToken },
}));
stories.add('using token as button with fallback to link on token failure with processing delay', () => ({
    template: `<streaming-player-link [infoForToken]="mockInfoForToken" [isButton]="true"></streaming-player-link>`,
    moduleMetadata: {
        providers: [
            {
                provide: GenerateTokenForSubscriptionWorkflowService,
                useValue: {
                    build: () =>
                        of(null).pipe(
                            delay(3000),
                            switchMap(() => throwError('error'))
                        ),
                },
            },
        ],
    },
    props: { mockInfoForToken },
}));
