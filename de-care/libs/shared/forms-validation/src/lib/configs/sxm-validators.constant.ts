import { ValidatorFn, Validators } from '@angular/forms';
import { atLeastTwoWordsValidator, containsCreditCardInfoValidator, creditCardValidator, cvvExclusionValidator, radioIdOrVinValidator } from '../functions/custom-validators';

type SxmLanguages = 'en-CA' | 'en-US' | 'fr-CA';
type sxmCountries = 'us' | 'ca';

interface SxmValidators {
    [key: string]: {
        [country in sxmCountries]?: {
            [lang in SxmLanguages]?: ValidatorFn[];
        };
    };
}

const regexCanadianPostalCode = /(^[A-HJ-UVWXYZ]{1}\d{1}[A-Z]{1}(\s?)\d{1}[A-HJ-UVWXYZ]{1}\d{1})/;

//Accept Alpha Characters with Accents including dashes and spaces
const regexCanadianEnglishAndFrench = /^[a-zA-ZÀ-ÿ- ]*$/;
//Accept Alpha Characters with Accents including dashes, dots and spaces in an Email format
export const regexCanadianEnglishAndFrenchEmail = /^((?!\.)[a-zA-ZÀ-ÿ-0-9-_+.]*)[@.]([a-zA-ZÀ-ÿ0-9-_]+)(\.[a-zA-ZÀ-ÿ0-9-_]+(\.[a-zA-ZÀ-ÿ0-9-_]+)?[^.\W])$/;

export const regexUSEmailValidationIncludingDomain = /^[\w-+\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const SXMVALIDATORS: SxmValidators = {
    creditCardName: {
        us: {
            'en-US': [
                Validators.required,
                cvvExclusionValidator,
                Validators.pattern(/^[a-zA-Z',\\.\-\s\\]+$/),
                atLeastTwoWordsValidator,
                Validators.minLength(2),
                Validators.maxLength(100)
            ]
        },
        ca: {
            'en-CA': [
                Validators.required,
                cvvExclusionValidator,
                Validators.pattern(/^[a-zA-ZÀ-ÿ',\\.\-\s\\]+$/),
                atLeastTwoWordsValidator,
                Validators.minLength(2),
                Validators.maxLength(100)
            ],
            'fr-CA': [
                Validators.required,
                cvvExclusionValidator,
                Validators.pattern(/^[a-zA-ZÀ-ÿ',\\.\-\s\\]+$/),
                atLeastTwoWordsValidator,
                Validators.minLength(2),
                Validators.maxLength(100)
            ]
        }
    },
    creditCardNumber: {
        us: {
            'en-US': [Validators.required, creditCardValidator, Validators.minLength(14), Validators.maxLength(19)]
        }
    },
    creditCardExpMonth: {
        us: {
            'en-US': [Validators.required]
        }
    },
    creditCardExpYear: {
        us: {
            'en-US': [Validators.required]
        }
    },
    creditCardExpDate: {
        us: {
            'en-US': [Validators.required, Validators.minLength(5), Validators.maxLength(5)]
        }
    },
    creditCardSecurityCode: {
        us: {
            'en-US': [Validators.required, Validators.pattern(/\d/), Validators.minLength(3), Validators.maxLength(4)]
        }
    },
    creditCardState: {
        us: {
            'en-US': [Validators.required]
        }
    },
    zipCode: {
        us: {
            'en-US': [Validators.required, cvvExclusionValidator, Validators.pattern(/(^\d{5}$)|(^\d{5}\-\d{4}$)/), Validators.minLength(5), Validators.maxLength(10)]
        },
        ca: {
            'en-CA': [Validators.required, cvvExclusionValidator, Validators.pattern(regexCanadianPostalCode), Validators.minLength(6), Validators.maxLength(7)],
            'fr-CA': [Validators.required, cvvExclusionValidator, Validators.pattern(regexCanadianPostalCode), Validators.minLength(6), Validators.maxLength(7)]
        }
    },
    address: {
        us: {
            'en-US': [
                cvvExclusionValidator,
                containsCreditCardInfoValidator,
                Validators.required,
                Validators.pattern(/^[\w,#\-\.\s\']+$/),
                Validators.minLength(2),
                Validators.maxLength(100)
            ]
        },
        ca: {
            'en-CA': [
                cvvExclusionValidator,
                containsCreditCardInfoValidator,
                Validators.required,
                Validators.pattern(/^[\wÀ-ÿ,#\-\.\s\']+$/),
                Validators.minLength(2),
                Validators.maxLength(100)
            ],
            'fr-CA': [
                cvvExclusionValidator,
                containsCreditCardInfoValidator,
                Validators.required,
                Validators.pattern(/^[\wÀ-ÿ,#\-\.\s\']+$/),
                Validators.minLength(2),
                Validators.maxLength(100)
            ]
        }
    },
    optionalAddress: {
        us: {
            'en-US': [cvvExclusionValidator, containsCreditCardInfoValidator, Validators.pattern(/^[\w,#\-\.\s\']+$/), Validators.minLength(2), Validators.maxLength(100)]
        },
        ca: {
            'en-CA': [cvvExclusionValidator, containsCreditCardInfoValidator, Validators.pattern(/^[\wÀ-ÿ,#\-\.\s\']+$/), Validators.minLength(2), Validators.maxLength(100)],
            'fr-CA': [cvvExclusionValidator, containsCreditCardInfoValidator, Validators.pattern(/^[\wÀ-ÿ,#\-\.\s\']+$/), Validators.minLength(2), Validators.maxLength(100)]
        }
    },
    city: {
        us: {
            'en-US': [
                Validators.required,
                containsCreditCardInfoValidator,
                cvvExclusionValidator,
                Validators.pattern(/^[\w\s]+$/),
                Validators.minLength(2),
                Validators.maxLength(50)
            ]
        },
        ca: {
            'en-CA': [
                Validators.required,
                containsCreditCardInfoValidator,
                cvvExclusionValidator,
                Validators.pattern(/^[\wÀ-ÿ'\-\.\s]+$/),
                Validators.minLength(2),
                Validators.maxLength(50)
            ],
            'fr-CA': [
                Validators.required,
                containsCreditCardInfoValidator,
                cvvExclusionValidator,
                Validators.pattern(/^[\wÀ-ÿ'\-\.\s]+$/),
                Validators.minLength(2),
                Validators.maxLength(50)
            ]
        }
    },
    province: {
        us: {
            'en-US': [Validators.required]
        },
        ca: {
            'en-CA': [Validators.required]
        }
    },
    firstName: {
        us: {
            'en-US': [Validators.required, cvvExclusionValidator, Validators.pattern(/^[a-zA-Z]+$/), Validators.minLength(1), Validators.maxLength(50)]
        },
        ca: {
            'en-CA': [Validators.required, cvvExclusionValidator, Validators.pattern(regexCanadianEnglishAndFrench), Validators.minLength(1), Validators.maxLength(50)],
            'fr-CA': [Validators.required, cvvExclusionValidator, Validators.pattern(regexCanadianEnglishAndFrench), Validators.minLength(1), Validators.maxLength(50)]
        }
    },
    lastName: {
        us: {
            'en-US': [Validators.required, cvvExclusionValidator, Validators.pattern(/^[a-zA-Z]+$/), Validators.minLength(1), Validators.maxLength(50)]
        },
        ca: {
            'en-CA': [Validators.required, cvvExclusionValidator, Validators.pattern(regexCanadianEnglishAndFrench), Validators.minLength(1), Validators.maxLength(50)],
            'fr-CA': [Validators.required, cvvExclusionValidator, Validators.pattern(regexCanadianEnglishAndFrench), Validators.minLength(1), Validators.maxLength(50)]
        }
    },
    email: {
        us: {
            'en-US': [Validators.required, cvvExclusionValidator, Validators.minLength(5), Validators.pattern(regexUSEmailValidationIncludingDomain)]
        },
        ca: {
            'en-CA': [Validators.required, cvvExclusionValidator, Validators.minLength(5), Validators.pattern(regexCanadianEnglishAndFrenchEmail)],
            'fr-CA': [Validators.required, cvvExclusionValidator, Validators.minLength(5), Validators.pattern(regexCanadianEnglishAndFrenchEmail)]
        }
    },
    optionalEmail: {
        us: {
            'en-US': [cvvExclusionValidator, Validators.minLength(5), Validators.pattern(regexUSEmailValidationIncludingDomain)]
        },
        ca: {
            'en-CA': [cvvExclusionValidator, Validators.minLength(5), Validators.pattern(regexCanadianEnglishAndFrenchEmail)],
            'fr-CA': [cvvExclusionValidator, Validators.minLength(5), Validators.pattern(regexCanadianEnglishAndFrenchEmail)]
        }
    },
    phoneNumber: {
        us: {
            'en-US': [Validators.required, Validators.pattern(/\d/), Validators.maxLength(10), Validators.minLength(10)]
        }
    },
    optionalPhoneNumber: {
        us: {
            'en-US': [Validators.pattern(/\d/), Validators.maxLength(10), Validators.minLength(10)]
        }
    },
    radioId: {
        us: {
            'en-US': [Validators.required, Validators.pattern(/^\w+$/), Validators.minLength(8), Validators.maxLength(12)]
        }
    },
    radioIdOrVin: {
        us: {
            'en-US': [Validators.required, radioIdOrVinValidator]
        }
    },
    accountNumber: {
        us: {
            'en-US': [Validators.required, Validators.pattern(/^[a-zA-Z]{0,2}[0-9]*(-?[0-9])*$/)]
        }
    },
    vin: {
        us: {
            'en-US': [Validators.required, Validators.pattern(/^\w+$/), Validators.minLength(11), Validators.maxLength(17)]
        }
    },
    licencePlateNumber: {
        us: {
            'en-US': [Validators.required, Validators.minLength(2)]
        }
    },
    agreement: {
        us: {
            'en-US': [Validators.requiredTrue]
        }
    },
    userName: {
        us: {
            'en-US': [Validators.required]
        }
    },
    password: {
        us: {
            'en-US': [Validators.required]
        }
    },
    registrationUserName: {
        us: {
            'en-US': [Validators.required, Validators.pattern(/^([_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{1,6}))?$|^[a-zA-Z0-9]{6,20}$/)]
        }
    },
    pinNumber: {
        us: {
            'en-US': [Validators.required]
        }
    },
    gcExpY: {
        us: {
            'en-US': [Validators.required]
        }
    },
    gcExpM: {
        us: {
            'en-US': [Validators.required]
        }
    },
    gcCVV: {
        us: {
            'en-US': [Validators.required, Validators.pattern(/\d/), Validators.minLength(3), Validators.maxLength(3)]
        }
    },
    promoCode: {
        us: {
            'en-US': [Validators.required]
        }
    }
};

export function getSxmValidator(
    validatorName: string,
    country: sxmCountries = 'us',
    lang: SxmLanguages = 'en-US',
    onNotFoundGetDefault: boolean = true
): ValidatorFn[] | null {
    const validator = SXMVALIDATORS[validatorName];
    const countryValidator = validator && validator[country];
    const langValidator = countryValidator && countryValidator[lang];
    // if not lang validator get default one
    if (!langValidator && onNotFoundGetDefault) {
        return getSxmValidator(validatorName, undefined, undefined, false);
    }
    return langValidator || null;
}
