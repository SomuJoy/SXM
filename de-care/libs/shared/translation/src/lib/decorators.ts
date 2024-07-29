import { LanguageResources } from './module-with-translation.module';
import * as uuid from 'uuid/v4';

export interface ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    providers?: any[];
}
export const ComponentLocale = ({ languageResources }: { languageResources: LanguageResources }) => {
    return (constructor) => {
        constructor.prototype.translateKeyPrefix = `${uuid()}_${constructor.name}`;
        constructor.prototype.languageResources = languageResources;
    };
};
