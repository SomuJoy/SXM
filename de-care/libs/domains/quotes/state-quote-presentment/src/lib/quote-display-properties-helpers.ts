export function isRoyaltyFee(description: string): boolean {
    return /Music[_\s]Royalty[_\s].*Fee$/.test(description);
}

export function isFreeUpgrade(description: string, feeAmount: number): boolean {
    return description === 'PACKAGE_UPGRADE_FEE' && Number(feeAmount) === 0;
}
