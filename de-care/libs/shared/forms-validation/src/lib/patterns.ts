export const regexUSEmailValidationIncludingDomain = /^[\w-+\.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const regexUsernameValidation = /^([_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{1,6}))?$|^[a-zA-Z0-9]{6,20}$/;
export const regexCanadianEnglishAndFrenchEmail = /^((?!\.)[a-zA-ZÀ-ÿ-0-9-_+.]*)[@.]([a-zA-ZÀ-ÿ0-9-_]+)(\.[a-zA-ZÀ-ÿ0-9-_]+(\.[a-zA-ZÀ-ÿ0-9-_]+)?[^.\W])$/;
export const flaggedSecurityCodeValidators = /^(?=.*(CVV|CAV|CVC|CID|SecurityID|SecurityCode|Security\#))(?=.*([0-9]{3,})).+/i;
export const visaRegExPattern = /^4[0-9]{12}(?:[0-9]{3})?$/;
export const masterCardRegExPattern = /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/;
export const amexRegExPattern = /^3[47][0-9]{13}$/;
export const dinersClubRegExPattern = /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/;
export const discoverRegExPattern = /^6(?:011|5[0-9]{2})[0-9]{12}$/;
export const jbcRegExPattern = /^(?:2131|1800|35\d{3})\d{11}$/;
/* tslint:disable */
export const unionPayRegExPattern =
    /^81[0-6][0-9]{13}$|^817[0-1][0-9]{12}$|^621094[0-9]{10}$|^62[4-6][0-9]{13}$|^628[2-8][0-9]{12}$|^62292[6-9][0-9]{10}$|^6229[3-9][0-9]{11}$|^623[0-6][0-9]{12}$|^6237[0-8][0-9]{11}$|^62379[0-6][0-9]{10}$/;
/* tslint:enable */
export const fullNameUS = /^[a-zA-Z',\\.\-\s\\]+$/;
export const fullNameCanada = /^[a-zA-ZÀ-ÿ',\\.\-\s\\]+$/;
export const namePiece = /^[a-zA-Z]+$/;
//Accept Alpha Characters with Accents including dashes and spaces
export const regexCanadianEnglishAndFrenchNamePiece = /^[a-zA-ZÀ-ÿ- ]*$/;
export const containsCreditCardInfoPattern = /\D*(?:\d\D*){13,}/;
export const streetAddressLine = /^[\w,#\-\.\s\']+$/;
export const streetAddressLineCanada = /^[\wÀ-ÿ,#\-\.\s\']+$/;
export const postalCode = /(^\d{5}$)|(^\d{5}\-\d{4}$)/;
export const postalCodeCanada = /(^[A-HJ-UVWXYZ]{1}\d{1}[A-Z]{1}(\s?)\d{1}[A-HJ-UVWXYZ]{1}\d{1})/;
export const radioIdLike = /^([A-Za-z0-9]{8}|[A-Za-z0-9]{10}|[A-Za-z0-9]{12}|[0-9A-Za-z]{4}-[0-9A-Za-z]{4}-[0-9A-Za-z]{4})$/;
export const vinLike = /^[A-Za-z0-9]{17}$/;
export const phoneLike = /^([[0-9]{10}|[0-9]{3}-[0-9]{3}-[0-9]{4})$/;
