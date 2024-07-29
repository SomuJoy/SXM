import { AliasingFn } from './har-mock.interface';
/**
 * This rudimentary method generates a readable identifier for an endpoint.
 * It is also used to index the endpoints so that they can be retrieved by the spec file when needed.
 * @param url The full URL
 */
export const defaultAliasingFn: AliasingFn = (method: string, url: string) => {
    const alias = url
        .replace(/[^A-Za-z0-9-_/]/g, '')
        .split('/')
        .map(([first, ...rest]) => (first !== undefined ? first.toUpperCase() + rest.join('').toLowerCase() : ''))
        .join('');

    return `${method}-${alias}`;
};

export const getAliasForURL = defaultAliasingFn;
