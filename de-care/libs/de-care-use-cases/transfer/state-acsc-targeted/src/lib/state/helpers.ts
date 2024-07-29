export function isPromo(type: string): boolean {
    return type === 'PROMO' || type === 'PROMO_MCP' || type === 'TRIAL_EXT';
}

//checks if radio ID contains only numbers
export function isRadioPlatformSirius(radioId): boolean {
    return /^\d+$/.test(radioId);
}

export function setFooterMessage(isSelfPayClosed: boolean, removeOldRadioId: boolean): string {
    if (!isSelfPayClosed && !removeOldRadioId) {
        return 'FOOTER_SERVICE_OFF';
    } else if (isSelfPayClosed && !removeOldRadioId) {
        return 'FOOTER_NO_SERVICE';
    } else if (!isSelfPayClosed && removeOldRadioId) {
        return 'FOOTER_SERVICE_OFF_REMOVE';
    } else {
        return 'FOOTER_SERVICE_REMOVE';
    }
}
