import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DeCareUseCasesAccountStateInfoCustomerCollectionModule } from '@de-care/de-care-use-cases/account/state-info-customer-collection';
import { CustomerInfoCollectionPageComponent } from './pages/customer-info-collection-page/customer-info-collection-page.component';
import { CustomerInfoConfirmationPageComponent } from './pages/customer-info-confirmation-page/customer-info-confirmation-page.component';
import { CustomerInfoConfirmationCanActivate } from './pages/customer-info-confirmation-page/customer-info-confirmation-can-activate.service';
import { SharedSxmUiUiTextFormFieldModule } from '@de-care/shared/sxm-ui/ui-text-form-field';
import { SharedSxmUiFormsUiFirstNameFormFieldModule } from '@de-care/shared/sxm-ui/forms/ui-first-name-form-field';
import { CustomerInfoCollectionCanActivate } from './pages/customer-info-collection-page/customer-info-collection-can-activate.service';
import { SharedSxmUiUiLastNameFormFieldModule } from '@de-care/shared/sxm-ui/ui-last-name-form-field';
import { SharedSxmUiUiEmailFormFieldModule } from '@de-care/shared/sxm-ui/ui-email-form-field';
import { SharedSxmUiUiPhoneNumberFormFieldModule } from '@de-care/shared/sxm-ui/ui-phone-number-form-field';
import { SharedSxmUiUiRadioidFormFieldModule } from '@de-care/shared/sxm-ui/ui-radioid-form-field';
import { SharedSxmUiUiAccountNumberFormFieldModule } from '@de-care/shared/sxm-ui/ui-account-number-form-field';
import { SharedSxmUiUiPostalCodeFormFieldModule } from '@de-care/shared/sxm-ui/ui-postal-code-form-field';
import { SharedSxmUiUiUsStateDropdownFormFieldModule } from '@de-care/shared/sxm-ui/ui-us-state-dropdown-form-field';
import { SharedSxmUiUiCityFormFieldModule } from '@de-care/shared/sxm-ui/ui-city-form-field';
import { SharedSxmUiUiStreetAddressFormFieldModule } from '@de-care/shared/sxm-ui/ui-street-address-form-field';
import { DeCareSharedUiPageShellBasicModule, PageShellBasicComponent, PageShellBasicRouteConfiguration } from '@de-care/de-care/shared/ui-page-shell-basic';
import { SharedSxmUiUiDateOfBirthFormFieldModule } from '@de-care/shared/sxm-ui/ui-date-of-birth-form-field';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { TempIncludeGlobalStyleScriptCanActivateService } from '@de-care/de-care-use-cases/shared/ui-router-common';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: PageShellBasicComponent,
                data: { pageShellBasic: { headerTheme: 'black' } as PageShellBasicRouteConfiguration },
                canActivate: [TempIncludeGlobalStyleScriptCanActivateService, CustomerInfoCollectionCanActivate],
                children: [
                    { path: '', pathMatch: 'full', component: CustomerInfoCollectionPageComponent },
                    { path: 'confirmation', canActivate: [CustomerInfoConfirmationCanActivate], component: CustomerInfoConfirmationPageComponent },
                ],
            },
        ]),
        TranslateModule.forChild(),
        ReactiveFormsModule,
        DeCareUseCasesAccountStateInfoCustomerCollectionModule,
        SharedSxmUiFormsUiFirstNameFormFieldModule,
        SharedSxmUiUiLastNameFormFieldModule,
        SharedSxmUiUiStreetAddressFormFieldModule,
        SharedSxmUiUiCityFormFieldModule,
        SharedSxmUiUiUsStateDropdownFormFieldModule,
        SharedSxmUiUiEmailFormFieldModule,
        SharedSxmUiUiPhoneNumberFormFieldModule,
        SharedSxmUiUiRadioidFormFieldModule,
        SharedSxmUiUiAccountNumberFormFieldModule,
        SharedSxmUiUiPostalCodeFormFieldModule,
        SharedSxmUiUiTextFormFieldModule,
        DeCareSharedUiPageShellBasicModule,
        SharedSxmUiUiDateOfBirthFormFieldModule,
        SharedSxmUiUiProceedButtonModule,
    ],
    declarations: [CustomerInfoCollectionPageComponent, CustomerInfoConfirmationPageComponent],
})
export class DeCareUseCasesAccountFeatureInfoCustomerCollectionModule {}
