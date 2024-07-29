import { of } from 'rxjs';

interface AdobeTargetMbox {
    name: string;
    options: { content: any }[];
}

export const mockAdobeTarget = (mboxes?: AdobeTargetMbox[]) => {
    Cypress.on('window:before:load', (window: any) => {
        const adobe = {
            target: {
                getOffers: () =>
                    of({
                        execute: {
                            mboxes: mboxes || [],
                        },
                    }),
                applyOffers: () => {},
            },
        };
        window['adobe'] = adobe;
    });
};
