import { defaultAliasingFn } from './har-mock.constants';
/**
 * Mocking using a HAR file
 *
 * A HAR file captures all network requests. Each browser provides an ability to download a HAR file at any point of time, but the generated file can have
 * a different structure based on the browser. There is a (now abandoned) spec here: https://w3c.github.io/web-performance/specs/HAR/Overview.html
 *
 * We can use a schematic to parse this file into a format we can use in Cypress tests and drastically reduce the size by omitting certain shared
 * requests (like package descriptions).
 *
 * These helpers below allow us to use this to set up cypress to mock these requests.
 *
 * ### Limitations:
 * This version of Cypress has limited functionality. There are two things that make it hard:
 *   1. There is no ability to specify a sequence of responses if a given endpoint is called more than once
 *   2. There is no "request matcher" that can be configured to target more specific requests: it's only by url and method.
 *
 * As a result, we can only reliably mock the first response here. However we return a map of all responses so that the spec file can `wait` and process
 * subsequent responses.
 *
 * We are using a rudimentary aliasing here - it provides a readable identifier (in the Cypress UI) but is also used to look up the entries for a given endpoint.
 *
 */
import { HarMock, HarProcessingOptions } from './har-mock.interface';

/**
 * Cypress can't mock multiple responses for an endpoint (in the current version). So we loop through the responses and index them
 * and only mock the first ones. The returned map can be used to mock further calls one at a time after the first resolves.
 *
 * @param harMockRequests Array of requests generated from parsing a HAR file (can't use an actual HAR file)
 * @param opts aliasingFn: a function to convert URL into an index; prefix: a string to prepend to the request URL
 * @returns Map of endpoints indexed by alias from `getAliasForURL`
 */
export const mockRoutesFromHAR = (harMockRequests: HarMock[], opts: HarProcessingOptions = { aliasingFn: defaultAliasingFn }) => {
    const usedRoutes = [];

    const mockedEndpointMap = harMockRequests.reduce((accum: any, val: HarMock) => {
        const alias = opts.aliasingFn(val.request.method, val.request.url);

        if (!accum[alias]) {
            usedRoutes.push(alias); // need to preserve the order
            accum[alias] = [];
        }

        accum[alias].push(val);

        return accum;
    }, {});

    usedRoutes.forEach((alias: string) => {
        const mock = mockedEndpointMap[alias][0]; // only the first

        cy.route({
            method: mock.request.method,
            url: `${opts?.prefix || '**'}${mock.request.url}`,
            status: mock.response.status,
            response: mock.response.content.text
        }).as(alias);
    });

    return mockedEndpointMap;
};
