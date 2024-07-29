export interface ContentGroup {
    id: number;
    name: string;
    zone2Header?: {
        id: number;
        name: string;
        headline: string;
    };
    imagesWithText?: {
        id: number;
        name: string;
        imageUrl: string;
        body: string;
    }[];
}
