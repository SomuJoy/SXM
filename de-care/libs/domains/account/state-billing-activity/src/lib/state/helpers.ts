export function createEntityCompositeKey(transactionDate: number, billNumber: string, serviceFor: string, description: string, locale: string): string {
    return `${transactionDate}-${billNumber}-${serviceFor}-${description} | ${locale}`;
}
