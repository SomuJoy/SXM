export interface CmsAsset {
    id: number;
    type: string;
    subtype: string;
    url: string;
    site: 'sxm' | string;
    lastModified: number;
}
