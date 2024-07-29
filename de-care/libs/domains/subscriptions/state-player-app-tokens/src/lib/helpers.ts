import { getUserAgentPlatform } from '@de-care/shared/browser-common/user-agent';
import { PlayerAppTokenConfig } from '@de-care/shared/configuration-tokens-player-app';

export function disabledForUserAgentPlatform(disableForBrowserUserAgentPlatforms: string[], userAgent: string): boolean {
    if (!disableForBrowserUserAgentPlatforms || !Array.isArray(disableForBrowserUserAgentPlatforms)) {
        return false;
    }
    const currentPlatform = getUserAgentPlatform(userAgent);
    if (disableForBrowserUserAgentPlatforms.includes(currentPlatform)) {
        return true;
    }
    return false;
}

export function createUrl(deeplinkUrl: string, useCase: string, playerAppTokenConfig: PlayerAppTokenConfig) {
    let extraQueryParamsAsString = '';
    let base = '';
    if (deeplinkUrl) {
        const deeplinkUrlPieces = new URL(deeplinkUrl);
        base = deeplinkUrlPieces?.pathname?.substr(1) || '/';
        if (deeplinkUrlPieces?.search?.length > 1) {
            extraQueryParamsAsString = `&${deeplinkUrlPieces.search.substr(1)}`;
        }
    }
    return `${playerAppTokenConfig.baseUrl}/orgs/${playerAppTokenConfig.org}/authn/flows/purchase-redirect-suspense?base=${base}${extraQueryParamsAsString}&useCase=${
        useCase || 'DEPurchaseCompletion'
    }`;
}
