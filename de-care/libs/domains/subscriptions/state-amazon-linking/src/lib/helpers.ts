export function buildAmazonLoginUrl(clientId, redirectUri, sessionId) {
    return `https://www.amazon.com/ap/oa?client_id=${clientId}&scope=alexa::skills:account_linking&response_type=code&redirect_uri=${redirectUri}&state=${sessionId}`;
}
