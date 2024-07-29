export class CreditCardUnexpectedError extends Error {
    constructor(message: string) {
        super();
        this.message = message;
        this.name = 'CredCardUnexpectedError';
    }
}
