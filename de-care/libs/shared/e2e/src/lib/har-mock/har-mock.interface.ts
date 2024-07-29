export interface HarMock {
    request: {
        method: string;
        url: string;
        postData: any;
    };
    response: {
        status: number;
        statusText: string;
        content: {
            mimeType: string;
            text: any;
        };
    };
}

export type AliasingFn = (method: string, url: string) => string;

export interface HarProcessingOptions {
    aliasingFn?: AliasingFn;
    prefix?: string;
}
