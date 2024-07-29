import { HarMock } from '../har-mock/har-mock.interface';
import { cyGetSpinner } from './common.po';
import { getBaseLocation } from '@de-care/browser-common';

export const sxmEnsureNoMissingTranslations = () => {
    cy.contains(/({{.+?}})/).should('not.exist'); // no translated text with unfulfilled interpolated values
};

export const sxmWaitForSpinner = () => {
    cyGetSpinner()
        .should('be.visible')
        .then(() => {
            cyGetSpinner().should('not.be.visible');
        });
};

export const sxmCheckPageLocation = (expectedPath: string) => {
    return cy.document().then(doc => {
        const baseURL = getBaseLocation(doc);
        return cy.location().should(loc => {
            const locationWithoutBase = baseURL ? loc.pathname.replace(baseURL, '/') : loc.pathname;
            expect(locationWithoutBase).to.eq(expectedPath);
        });
    });
};

export const sxmCheckParams = (params: string) => {
    cy.location().should(loc => {
        const currentParams = new URLSearchParams(loc.search);
        const paramsToCheck = new URLSearchParams(params);
        currentParams.sort();
        paramsToCheck.sort();
        expect(currentParams.toString()).to.eq(paramsToCheck.toString());
    });
};

export const sxmReplaceMockFromHAR = (mocks: { [key: string]: Partial<HarMock>[] }, alias: string, index: number) => {
    cy.route(`${mocks[alias][index].request.method}`, `**${mocks[alias][index].request.url}`, mocks[alias][index].response.content.text).as(alias);
};

export const sxmIsCanadaMode = () => {
    return Cypress.env('isCanada');
};

export const getIsCanada: () => boolean = () => Cypress.env('isCanada');
