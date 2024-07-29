import { Envelope } from '@cucumber/messages';
import { Query as GherkinQuery } from '@cucumber/gherkin-utils';
import { Query } from '@cucumber/query';

export const initQueryEngine = (envelopes: Envelope[]) => {
    const gherkinQuery = new GherkinQuery();
    const cucumberQuery = new Query();
    envelopes.forEach((envelope) => {
        try {
            gherkinQuery.update(envelope);
            cucumberQuery.update(envelope);
        } catch {}
    });
    return {
        gherkinQuery,
        cucumberQuery,
    };
};
