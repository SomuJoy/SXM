import { FormBuilder, FormGroup } from '@angular/forms';
import { SxmLanguages } from '@de-care/app-common';
import { FlepzData } from '@de-care/de-care-use-cases/account/state-registration';
import { sxmCountries } from '@de-care/settings';
import { getSxmValidator } from '@de-care/shared/validation';

export class CNAForm extends FormGroup {
    readonly firstName = this.get('firstName');
    readonly lastName = this.get('lastName');
    readonly email = this.get('email');
    readonly addressLine1 = this.get('addressLine1');
    readonly city = this.get('city');
    readonly state = this.get('state');
    readonly zip = this.get('zip');
    readonly phone = this.get('phone');

    constructor(readonly model: FlepzData, language: SxmLanguages, country: sxmCountries, readonly fb: FormBuilder = new FormBuilder()) {
        super(
            fb.group({
                firstName: [model?.firstName, { updateOn: 'blur' }],
                lastName: [model?.lastName, { updateOn: 'blur' }],
                email: [model?.email, { updateOn: 'blur' }],
                addressLine1: ['', { updateOn: 'blur' }],
                city: ['', { updateOn: 'blur' }],
                state: ['', { updateOn: 'blur' }],
                zip: [model?.zipCode, { updateOn: 'blur' }],
                phone: [model?.phoneNumber, { updateOn: 'blur' }]
            }).controls
        );

        this.firstName.setValidators(getSxmValidator('firstName', country, language));
        this.lastName.setValidators(getSxmValidator('lastName', country, language));
        this.email.setValidators(getSxmValidator('email', country, language));
        this.addressLine1.setValidators(getSxmValidator('address', country, language));
        this.city.setValidators(getSxmValidator('city', country, language));
        this.state.setValidators(getSxmValidator('province', country, language));
        this.zip.setValidators(getSxmValidator('zipCode', country, language));
        this.phone.setValidators(getSxmValidator('phoneNumber', country, language));
    }
}
