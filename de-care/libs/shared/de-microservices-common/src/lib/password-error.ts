export class PasswordUnexpectedError extends Error {
    constructor(message: string) {
        super();
        this.message = message;
        this.name = 'PasswordUnexpectedError';
    }
}
