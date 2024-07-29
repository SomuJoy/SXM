// TODO: STORYBOOK_AUDIT

// import { CommonModule } from '@angular/common';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { RouterTestingModule } from '@angular/router/testing';
// import { DataValidationService } from '@de-care/data-services';
// import { SharedEventTrackService } from '@de-care/data-layer';
// import { EffectsModule } from '@ngrx/effects';
// import { StoreModule } from '@ngrx/store';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { AppTimer, Timer } from '@de-care/shared/legacy-core/timer';
// import { BehaviorSubject, Observable, of } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { MOCK_DATA_LAYER_PROVIDER, TRANSLATE_PROVIDERS, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { ReviewSubscriptionOptionsComponent } from './review-subscription-options.component';
// import { UserSettingsService } from '@de-care/settings';
// import { PurchaseModule } from '../../purchase.module';
//
// class TestStore<T> {
//     private state: BehaviorSubject<T> = new BehaviorSubject(undefined);
//     setState(data: T) {
//         this.state.next(data);
//     }
//     select(selector?: any): Observable<T> {
//         return selector ? this.state.asObservable().pipe(map(selector)) : this.state.asObservable();
//     }
//     pipe(args: any): Observable<T> {
//         return args ? this.state.asObservable().pipe(args) : this.state.asObservable();
//     }
//     dispatch(action: any) {}
// }
//
// const stories = storiesOf('purchase/review-subscription-component', module)
//     .addDecorator(withKnobs)
//     .addDecorator(withA11y)
//     .addDecorator(
//         moduleMetadata({
//             imports: [CommonModule, BrowserAnimationsModule, RouterTestingModule, StoreModule.forRoot({}), EffectsModule.forRoot([]), PurchaseModule],
//             providers: [
//                 ...TRANSLATE_PROVIDERS,
//                 MOCK_DATA_LAYER_PROVIDER,
//                 { provide: DataValidationService, useValue: { validateUserName: of({ valid: true }) } },
//                 { provide: SharedEventTrackService, useValue: { track: () => {} } },
//                 { provide: AppTimer, useClass: Timer }
//             ]
//         })
//     )
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// stories.add('All Access - 1mo - wActv', () => ({
//     component: ReviewSubscriptionOptionsComponent,
//     moduleMetadata: {
//         providers: [{ provide: UserSettingsService, useValue: { dateFormat$: of('MM/dd/yy') } }]
//     },
//     props: {
//         timezone: null,
//         locale: 'en-US ',
//         renewalPlan: {
//             selectedRenewalPackageName: 'SIR_AUD_ALLACCESS',
//             monthlyPrice: '21.99',
//             endDate: '2021-06-12'
//         }
//     },
//     translation: { enabled: false }
// }));
//
// stories.add('Select - 1mo - wActv', () => ({
//     component: ReviewSubscriptionOptionsComponent,
//     moduleMetadata: {
//         providers: [{ provide: UserSettingsService, useValue: { dateFormat$: of('MM/dd/yy') } }]
//     },
//     props: {
//         timezone: null,
//         locale: 'en-US ',
//         renewalPlan: {
//             selectedRenewalPackageName: 'SIR_AUD_ALLACCESS',
//             monthlyPrice: '16.99',
//             endDate: '2021-06-12'
//         }
//     },
//     translation: { enabled: false }
// }));
//
// stories.add('Mostly Music - 1mo - wActv', () => ({
//     component: ReviewSubscriptionOptionsComponent,
//     moduleMetadata: {
//         providers: [{ provide: UserSettingsService, useValue: { dateFormat$: of('MM/dd/yy') } }]
//     },
//     props: {
//         timezone: null,
//         locale: 'en-US ',
//         renewalPlan: {
//             selectedRenewalPackageName: 'SIR_AUD_ALLACCESS',
//             monthlyPrice: '10.99',
//             endDate: '2021-06-12'
//         }
//     },
//     translation: { enabled: false }
// }));
