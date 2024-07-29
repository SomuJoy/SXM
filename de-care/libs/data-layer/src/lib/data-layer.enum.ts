//********************************************************************************
export enum FrontEndErrorEnum {
    GenMissingEmail = 'General - Missing or invalid email', // ToDo: not used yet

    MissingUserName = 'Auth - Missing username',
    MissingPassword = 'Auth - Missing password',
    IncorrectUserPassword = 'Auth - Incorrect username and/or password',
    IdentMissingFirstName = 'Auth - Missing first name',
    IdentMissingLastName = 'Auth - Missing last name',
    IdentMissingEmail = 'Auth - Missing or invalid email',
    IdentMissingPassword = 'Auth - Missing or invalid password',
    IdentMissingPhone = 'Auth - Missing or invalid phone number',
    IdentMissingZipCode = 'Auth - Missing or invalid zip code',
    IdentMissingStreetAddress = 'Auth - Missing or invalid street address',
    IdentMissingRadioId = 'Auth - Missing or incomplete radio ID',
    IdentMissingVIN = 'Auth - Missing or invalid VIN',
    IdentMissingLicense = 'Auth - Missing or invalid license plate number',
    IdentMissingState = 'Auth - Missing state',
    IdentMissingVINAgreement = 'Auth - VIN lookup agreement not selected',
    IdentAccountNotSupported = 'Auth - Account type not supported',
    UnableToAuthenticate = 'Auth - Unable to authenticate',

    CheckoutMissingPaymentOption = 'Checkout - Payment option not selected',
    CheckoutInvalidCCName = 'Checkout - Missing or invalid name on credit card',
    CheckoutInvalidCCNumber = 'Checkout - Missing or invalid credit card number',
    CheckoutInvalidCCMonth = 'Checkout - Missing or invalid credit card expiry month',
    CheckoutInvalidCCYear = 'Checkout - Missing or invalid credit card expiry year',
    CheckoutInvalidCCcvv = 'Checkout - Missing or invalid CVV',
    CheckoutMissingAddress = 'Checkout - Missing street address',
    CheckoutMissingCity = 'Checkout - Missing city',
    CheckoutMissingState = 'Checkout - State not selected',
    CheckoutMissingZipCode = 'Checkout - Missing or incomplete zip code',
    CheckoutInvalidEmail = 'Checkout - Missing or invalid email',
    CheckoutInvalidPassword = 'Checkout - Missing or invalid password',
    CheckoutMissingPrepaidPin = 'Checkout - Missing or incomplete prepaid card PIN', // ToDo: not used yet
    CheckoutMissingCCAgreement = 'Checkout - Credit Card Agreement not selected',

    RegistrationMissingUsername = 'Registration - Missing username',
    RegistrationUsernameAlreadyUsed = 'Registration - Username already exist',
    RegistrationUsernameInvalid = 'Registration - Username invalid',
    RegistrationMissingPassword = 'Registration - Missing password',
    RegistrationInvalidPassCriteria = 'Registration - Invalid password - does not meet criteria',
    RegistrationInvalidPassShort = 'Registration - Invalid password - too short',
    RegistrationInvalidPassReserveWord = 'Your password cannot include reserve word(s)',
    RegistrationInvalidSecurityQ = 'Registration - Security Question not selected',
    RegistrationInvalidSecurityQA = 'Registration - Missing answer to Security Question',

    NewAccountUnableToCreate = 'NewAccount - Unable to create account',

    EventFailedActVerify = 'Auth - Failed account verification',
    EventInvalidVINLookup = 'Auth - Invalid VIN Lookup',
    EventExpiredCCOnFile = 'Checkout - Expired card on file',
    EventInvalidCCExpDate = 'Checkout - Invalid expiration date',
    EventCCNotAuthorized = 'Checkout - CC not authorized',

    GeneralMissingOrInvalidEmail = 'General - Missing or invalid email',
    NucaptchaIncorrect = 'General - Missing or invalid nucaptcha'
}

export enum BusinessErrorEnum {
    EventLoginNoRadio = 'Auth - Login - No radio found',
    EventFlepzNoRadio = 'Auth - FLEPZ - No radio found'
}

export enum PurchasePlanRevenueStatus {
    Immediate = 'Immediate',
    Deferred = 'Deferred'
}
