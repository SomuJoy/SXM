// TODO: STORYBOOK_AUDIT

// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';
// import { FormGroup, ReactiveFormsModule } from '@angular/forms';
// import { TranslateModule } from '@ngx-translate/core';
// import { TRANSLATE_PROVIDERS } from '@de-care/shared/storybook/util-helpers';
// import { DomainsAccountUiSecurityQuestionsFormFieldsModule } from '../domains-account-ui-security-questions-form-fields.module';
// import { Question } from './security-questions-form-fields.component';
//
// const stories = storiesOf('Domains/Account/Forms/SecurityQuestionsFormFields', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [ReactiveFormsModule, TranslateModule.forRoot(), DomainsAccountUiSecurityQuestionsFormFieldsModule],
//             providers: [...TRANSLATE_PROVIDERS]
//         })
//     );
//
// stories.add('default', () => ({
//     template: `
//         <form [formGroup]="form" (ngSubmit)="onSubmit(form.value)">
//             <de-care-security-questions-form-fields [questions]="questions" [formGroup]="form"></de-care-security-questions-form-fields>
//             <button type="submit">Submit</button>
//         </form>
//     `,
//     props: {
//         form: new FormGroup({}),
//         questions: [
//             { id: 100, question: "Favorite pet's name" },
//             { id: 101, question: 'Favorite place to visit' },
//             { id: 102, question: 'First phone number' },
//             { id: 103, question: 'Favorite sports team' },
//             { id: 104, question: 'Favorite beverage' },
//             { id: 105, question: 'Favorite movie' },
//             { id: 106, question: 'First car make' },
//             { id: 107, question: 'Favorite childhood friend' },
//             { id: 108, question: 'First employer' },
//             { id: 109, question: 'Favorite school' },
//             { id: 110, question: 'First concert' },
//             { id: 111, question: 'First music purchase' },
//             { id: 112, question: 'Favorite place to live' },
//             { id: 113, question: 'Favorite band/artist' },
//             { id: 114, question: 'Favorite music genre' }
//         ] as Question[],
//         onSubmit: action('Form submitted')
//     }
// }));
