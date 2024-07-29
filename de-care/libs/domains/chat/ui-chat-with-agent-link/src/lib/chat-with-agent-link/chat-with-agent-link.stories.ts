// TODO: STORYBOOK_AUDIT

// import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { DomainsChatUiChatWithAgentLinkModule } from '../domains-chat-ui-chat-with-agent-link.module';
// import { ChatProviderToken } from '../data-services/chat-provider-token';
// import { ChatWithAgentLinkComponent } from './chat-with-agent-link.component';
// import { Queues } from '../data-services/queues';
// import { withKnobs } from '@storybook/addon-knobs';
// import { withA11Y } from '@storybook/addon-a11y';
//
// const commonModuleMetadata = {
//     imports: [DomainsChatUiChatWithAgentLinkModule]
// };
//
// storiesOf('Domains/chat/ChatWithAgentLink - 247', module)
//     .addDecorator(
//         moduleMetadata({
//             ...commonModuleMetadata,
//             providers: [
//                 TRANSLATE_PROVIDERS,
//                 {
//                     provide: ChatProviderToken,
//                     useValue: '247'
//                 }
//             ]
//         })
//     )
//     .addDecorator(withA11Y)
//     .addDecorator(withKnobs)
//     .add('default', () => ({
//         component: ChatWithAgentLinkComponent,
//         props: {
//             chatLinkText: 'Chat with an agent',
//             queue: 'general' as Queues
//         }
//     }))
//     .addDecorator(withTranslation);
//
// storiesOf('Domains/chat/ChatWithAgentLink - LivePerson', module)
//     .addDecorator(
//         moduleMetadata({
//             ...commonModuleMetadata,
//             providers: [
//                 TRANSLATE_PROVIDERS,
//                 {
//                     provide: ChatProviderToken,
//                     useValue: 'liveperson'
//                 }
//             ]
//         })
//     )
//     .addDecorator(withA11Y)
//     .addDecorator(withKnobs)
//     .add('default', () => ({
//         component: ChatWithAgentLinkComponent,
//         props: {
//             chatLinkText: 'Chat with an agent',
//             queue: 'general' as Queues
//         }
//     }))
//     .addDecorator(withTranslation);
//
