import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
    amexRegExPattern,
    containsCreditCardInfoPattern,
    dinersClubRegExPattern,
    discoverRegExPattern,
    flaggedSecurityCodeValidators,
    fullNameCanada,
    fullNameUS,
    jbcRegExPattern,
    masterCardRegExPattern,
    namePiece,
    postalCode,
    postalCodeCanada,
    regexCanadianEnglishAndFrenchEmail,
    regexCanadianEnglishAndFrenchNamePiece,
    regexUSEmailValidationIncludingDomain,
    regexUsernameValidation,
    streetAddressLine,
    streetAddressLineCanada,
    unionPayRegExPattern,
    visaRegExPattern,
    radioIdLike,
    vinLike,
    phoneLike,
} from './patterns';
import { atLeastOneNullInValidatorSet, getCurrentDateMonthYear, numberOfErrorsInValidatorSet, runValidatorSetAndGetFirstError } from './helpers';

@Injectable({ providedIn: 'root' })
export class SxmValidators {
    constructor(private readonly _translateService: TranslateService) {}

    get email(): ValidatorFn {
        return (control) => runValidatorSetAndGetFirstError([Validators.required, this.cvvExclusion, Validators.minLength(5), this._emailPatternRequirement], control);
    }

    get optionalEmail(): ValidatorFn {
        return (control) => runValidatorSetAndGetFirstError([this.cvvExclusion, Validators.minLength(5), this._emailPatternRequirement], control);
    }

    get emailForLookup(): ValidatorFn {
        return (control) => runValidatorSetAndGetFirstError([Validators.required, Validators.minLength(5), this._emailPatternRequirement], control);
    }
    get username(): ValidatorFn {
        return (control) => runValidatorSetAndGetFirstError([Validators.required, Validators.minLength(6), this._usernamePatternRequirement], control);
    }

    get optionalUsername(): ValidatorFn {
        return (control) => runValidatorSetAndGetFirstError([Validators.minLength(6), this._usernamePatternRequirement], control);
    }

    get password(): ValidatorFn {
        return (control) => runValidatorSetAndGetFirstError([Validators.required, Validators.minLength(8), this._passwordCharRequirement], control);
    }

    get namePiece(): ValidatorFn {
        return (control) =>
            runValidatorSetAndGetFirstError(
                [
                    Validators.required,
                    this.cvvExclusion,
                    Validators.pattern(this._isCanada ? regexCanadianEnglishAndFrenchNamePiece : namePiece),
                    Validators.minLength(1),
                    Validators.maxLength(50),
                ],
                control
            );
    }

    get phoneNumber(): ValidatorFn {
        return (control) => runValidatorSetAndGetFirstError([Validators.required, Validators.pattern(/\d/), Validators.maxLength(10), Validators.minLength(10)], control);
    }

    get streetAddressLine(): ValidatorFn {
        return (control) =>
            runValidatorSetAndGetFirstError(
                [
                    this.cvvExclusion,
                    this.creditCardExclusion,
                    Validators.required,
                    Validators.pattern(this._isCanada ? streetAddressLineCanada : streetAddressLine),
                    Validators.minLength(2),
                    Validators.maxLength(100),
                ],
                control
            );
    }

    get city(): ValidatorFn {
        return (control) =>
            runValidatorSetAndGetFirstError(
                [
                    Validators.required,
                    this.creditCardExclusion,
                    this.cvvExclusion,
                    Validators.pattern(this._isCanada ? /^[\wÀ-ÿ'\-\.\s]+$/ : /^[\w\s]+$/),
                    Validators.minLength(2),
                    Validators.maxLength(50),
                ],
                control
            );
    }

    get stateProvince(): ValidatorFn {
        return (control) => runValidatorSetAndGetFirstError([Validators.required], control);
    }

    get postalCode(): ValidatorFn {
        return (control) =>
            runValidatorSetAndGetFirstError(
                [
                    Validators.required,
                    this.cvvExclusion,
                    Validators.pattern(this._isCanada ? postalCodeCanada : postalCode),
                    Validators.minLength(this._isCanada ? 6 : 5),
                    Validators.maxLength(this._isCanada ? 7 : 10),
                ],
                control
            );
    }

    get countryCode(): ValidatorFn {
        return (control) => runValidatorSetAndGetFirstError([Validators.required], control);
    }

    get creditCardName(): ValidatorFn {
        return (control) => {
            return runValidatorSetAndGetFirstError(
                [
                    Validators.required,
                    this.cvvExclusion,
                    Validators.pattern(this._isCanada ? fullNameCanada : fullNameUS),
                    this._atLeastTwoWords,
                    Validators.minLength(2),
                    Validators.maxLength(100),
                ],
                control
            );
        };
    }

    get creditCardNumber(): ValidatorFn {
        return (control) =>
            runValidatorSetAndGetFirstError([Validators.required, this._allowedCreditCardPatterns, Validators.minLength(14), Validators.maxLength(19)], control);
    }

    get creditCardExpiredDate(): ValidatorFn {
        return (control) =>
            runValidatorSetAndGetFirstError([Validators.required, Validators.minLength(5), Validators.maxLength(5), this._creditCardExpirationDateCurrent], control);
    }

    cvvBasedOnCardNumberControl(cardNumberControl: AbstractControl): ValidatorFn {
        return (control) => {
            const length = amexRegExPattern.test(cardNumberControl.value) ? 4 : 3;
            return runValidatorSetAndGetFirstError([Validators.required, Validators.pattern(/\d/), Validators.minLength(length), Validators.maxLength(length)], control);
        };
    }

    get cvvExclusion(): ValidatorFn {
        return (control) => (flaggedSecurityCodeValidators.test(control.value) ? { cvvExclusion: true } : null);
    }

    get creditCardExclusion(): ValidatorFn {
        return (control) => (containsCreditCardInfoPattern.test(control.value) ? { containsCCInfo: true } : null);
    }

    get radioIdOrVin(): ValidatorFn {
        return (control) => runValidatorSetAndGetFirstError([Validators.required, this._radioIdOrVinPatternRequirement], control);
    }

    get radioIdOrVinOrPhoneNummber(): ValidatorFn {
        return (control) => runValidatorSetAndGetFirstError([Validators.required, this._radioIdOrVinOrPhoneNumberPatternRequirement], control);
    }

    get accountNumber(): ValidatorFn {
        return (control) => runValidatorSetAndGetFirstError([Validators.required, Validators.pattern(/^[a-zA-Z]{0,2}[0-9]*(-?[0-9])*$/)], control);
    }

    get basicDate(): ValidatorFn {
        return (control) => runValidatorSetAndGetFirstError([Validators.required, Validators.pattern(/^\d{1,2}\/\d{1,2}\/\d{4}$/)], control);
    }

    get dateOfBirth(): ValidatorFn {
        return (control) => runValidatorSetAndGetFirstError([Validators.required, Validators.pattern(/^\d{1,2}\/\d{1,2}$/), this._dateAndMonthVerification], control);
    }

    private get _emailPatternRequirement(): ValidatorFn {
        return (control) =>
            Validators.pattern(this._isCanada ? regexCanadianEnglishAndFrenchEmail : regexUSEmailValidationIncludingDomain)(control)
                ? { emailPatternRequirement: true }
                : null;
    }

    private get _usernamePatternRequirement(): ValidatorFn {
        return (control) => (Validators.pattern(regexUsernameValidation)(control) ? { usernamePatternRequirement: true } : null);
    }

    private get _passwordCharRequirement(): ValidatorFn {
        return (control) => {
            if (
                numberOfErrorsInValidatorSet(
                    [Validators.pattern(/(?=.*\d)/), Validators.pattern(/(?=.*[a-z])/), Validators.pattern(/(?=.*[A-Z])/), Validators.pattern(/[!%&@#$^*?_~()-+,=]/)],
                    control
                ) > 1
            ) {
                return { passwordCharRequirement: true };
            }
            return null;
        };
    }

    private get _allowedCreditCardPatterns(): ValidatorFn {
        return (control) => {
            return atLeastOneNullInValidatorSet(
                [
                    Validators.pattern(visaRegExPattern),
                    Validators.pattern(masterCardRegExPattern),
                    Validators.pattern(amexRegExPattern),
                    Validators.pattern(dinersClubRegExPattern),
                    ...(!this._isCanada ? [Validators.pattern(discoverRegExPattern)] : []),
                    Validators.pattern(jbcRegExPattern),
                    Validators.pattern(unionPayRegExPattern),
                ],
                control
            )
                ? null
                : { inValidCard: true };
        };
    }

    private get _creditCardExpirationDateCurrent(): ValidatorFn {
        return (control) => {
            const value = control.value;
            const date = getCurrentDateMonthYear();
            if (value) {
                const matches: string[] = value.match(/([\d]{1,2})\/*([\d]{1,2})?/);
                if (
                    parseInt(`20${matches[2]}`, 10) < date.year ||
                    (parseInt(`20${matches[2]}`, 10) === date.year && parseInt(matches[1], 10) < date.month) ||
                    value.length < 5
                ) {
                    return { invalidDate: true };
                }
            }
            return null;
        };
    }

    private get _atLeastTwoWords(): ValidatorFn {
        return (control) => (control.value && control.value.trim().indexOf(' ') === -1 ? { atLeastTwoWords: true } : null);
    }

    private get _isCanada(): boolean {
        return canadaLangCodes.has(this._translateService.currentLang);
    }

    private get _radioIdOrVinPatternRequirement(): ValidatorFn {
        return (control) => {
            console.log(control);
            return Validators.pattern(radioIdLike)(control) && Validators.pattern(vinLike)(control) ? { radioIdOrVinPatternRequirement: true } : null;
        };
    }

    private get _radioIdOrVinOrPhoneNumberPatternRequirement(): ValidatorFn {
        return (control) => {
            console.log(control);
            return Validators.pattern(radioIdLike)(control) && Validators.pattern(vinLike)(control) && Validators.pattern(phoneLike)(control)
                ? { radioIdOrVinPatternRequirement: true }
                : null;
        };
    }

    private get _dateAndMonthVerification(): ValidatorFn {
        return (control) => {
            const controlValue = control.value?.toString();
            return +controlValue?.slice(0, 2) > 31 || +controlValue?.slice(-2) > 12 ? { invalidDate: true } : null;
        };
    }
}

const canadaLangCodes = new Set(['en-CA', 'fr-CA']);
