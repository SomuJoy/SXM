import { storiesOf, moduleMetadata } from '@storybook/angular';
import { DomainsSubscriptionsUiPlayerAppIntegrationModule } from '../domains-subscriptions-ui-player-app-integration.module';
// eslint-disable-next-line
import { TRANSLATE_PROVIDERS, MOCK_NGRX_STORE_PROVIDER, withTranslation } from '../../../../../../shared/storybook/util-helpers/src';
import { GenerateTokenForSubscriptionWorkflowService } from '@de-care/domains/subscriptions/state-player-app-tokens';
import { of, timer, throwError } from 'rxjs';
import { map, mapTo, delay, switchMap } from 'rxjs/operators';

const stories = storiesOf('Component Library/Molecules/Listen Now Link', module)
    .addDecorator(
        moduleMetadata({
            imports: [DomainsSubscriptionsUiPlayerAppIntegrationModule],
            providers: [...TRANSLATE_PROVIDERS, MOCK_NGRX_STORE_PROVIDER, { provide: GenerateTokenForSubscriptionWorkflowService, useValue: { build: () => of(null) } }],
        })
    )
    .addDecorator(withTranslation);

stories.add('default', () => ({
    template: `<listen-now></listen-now>`,
}));

const mockInfoForToken = { subscriptionId: '123', useCase: 'test' };
const mockPlayerTokenData = { token: 'abc', url: 'https://link-orch.sit05.idm.siriusxm.com/' };
const mockPlayerTokenWorkflow = { build: () => of(mockPlayerTokenData) };
stories.add('using token', () => ({
    template: `<listen-now [infoForToken]="mockInfoForToken"></listen-now>`,
    moduleMetadata: {
        providers: [{ provide: GenerateTokenForSubscriptionWorkflowService, useValue: mockPlayerTokenWorkflow }],
    },
    props: { mockInfoForToken },
}));

stories.add('with custom link URL', () => ({
    template: `<listen-now customLink="https://player.siriusxm.com"></listen-now>`,
}));
