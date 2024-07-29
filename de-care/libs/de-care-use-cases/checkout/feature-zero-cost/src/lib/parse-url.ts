// TODO: Move this to a common util location somewhere so it can be used anytime we need to deal with a relative URL route in an CanActivate guard
export function parseUrl(url: string, redirectTo: string) {
    const urlTokens = url.split('/');
    const redirectToTokens = redirectTo.split('/');
    let token = redirectToTokens.shift();
    while (token) {
        if (token !== '.' && token !== '..') {
            redirectToTokens.unshift(token);
            break;
        }
        if (token === '..') {
            urlTokens.pop();
        }
        token = redirectToTokens.shift();
    }
    urlTokens.push(...redirectToTokens);
    return urlTokens.join('/');
}
