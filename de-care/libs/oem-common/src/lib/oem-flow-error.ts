export class CAAccountError extends Error {
    constructor(message: string) {
        super();
        this.message = message;
        this.name = 'CAAccountError';
    }
}

export class ActiveSubscriptionError extends Error {
    constructor(message: string) {
        super();
        this.message = message;
        this.name = 'ActiveSubscriptionError';
    }
}
