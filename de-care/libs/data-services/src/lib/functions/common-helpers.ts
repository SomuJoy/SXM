const QC_POSTAL_CODE = /[GHJghj].*/;

export function isQCPostalCode(postalCode: string): boolean {
    return QC_POSTAL_CODE.test(postalCode);
}
