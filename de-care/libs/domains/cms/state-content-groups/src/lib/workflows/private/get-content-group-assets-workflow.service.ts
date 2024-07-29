import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { forkJoin, Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { ImageWithTextContentService } from '../../data-services/image-with-text-content.service';
import { ImageWithTextGroupService } from '../../data-services/image-with-text-group.service';
import { TextContentService } from '../../data-services/text-content.service';

interface AssetInfo {
    id: number;
    type: string;
    subtype: string;
}

interface Results {
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

interface Zone2HeaderResult extends AssetInfo {
    name: string;
    headline: string;
}
interface ImageWithTextResult extends AssetInfo {
    name: string;
    imageUrl: string;
    body: string;
}

const filterByZone2Header = (info: AssetInfo) => info.type === 'SXMTextContent' && info.subtype === 'Zone2Header';
const filterByImageWithTextGroup = (info: AssetInfo) => info.type === 'SXMImageWithTextGroup' && info.subtype === 'ImageWithTextGroup';
const filterByImageWithTexContent = (info: AssetInfo) => info.type === 'SXMImageWithText' && info.subtype === 'ImageWithText';

@Injectable({ providedIn: 'root' })
export class GetContentGroupAssetsWorkflowService implements DataWorkflow<AssetInfo[], Results | null> {
    constructor(
        private readonly _textContentService: TextContentService,
        private readonly _imageWithTextService: ImageWithTextGroupService,
        private readonly _imageWithTextContentService: ImageWithTextContentService
    ) {}

    build(assetInfos: AssetInfo[]): Observable<Results | null> {
        const streams = [];
        const zone2HeaderInfo = assetInfos.find(filterByZone2Header);
        if (zone2HeaderInfo) {
            streams.push(
                this._textContentService.getTextContent(zone2HeaderInfo.id).pipe(map((result) => ({ ...zone2HeaderInfo, name: result.name, headline: result.headline })))
            );
        }
        const imagesWithTextGroup = assetInfos.find(filterByImageWithTextGroup);
        if (imagesWithTextGroup) {
            streams.push(
                this._imageWithTextService.getImageWithTextGroupAssets(imagesWithTextGroup.id).pipe(
                    map((result) => ({ ...imagesWithTextGroup, ids: result.image_with_text_group_recommendation?.map((item) => item.id) })),
                    concatMap((group) => {
                        const streams = group.ids.map((id) =>
                            this._imageWithTextContentService.getImageWithTextContent(id).pipe(
                                map((result) => ({
                                    id,
                                    name: result.name,
                                    type: result.type,
                                    subtype: result.subtype,
                                    imageUrl: result.image_with_text_image,
                                    body: result.image_with_text_body,
                                }))
                            )
                        );
                        return forkJoin(streams);
                    })
                )
            );
        }
        return forkJoin(streams).pipe(
            map((items) =>
                items.reduce((set: unknown[], next: unknown[] | unknown) => {
                    return [...set, ...(Array.isArray(next) ? next : [next])];
                }, [])
            ),
            map<(Zone2HeaderResult | ImageWithTextResult)[], Results>((resultSet) => {
                const zone2HeaderResult = resultSet.find(filterByZone2Header) as Zone2HeaderResult;
                const imageWithTextContentResults = resultSet.filter(filterByImageWithTexContent) as ImageWithTextResult[];
                const results: Results = {
                    ...(zone2HeaderResult
                        ? {
                              zone2Header: {
                                  id: zone2HeaderResult.id,
                                  name: zone2HeaderResult.name,
                                  headline: zone2HeaderResult.headline,
                              },
                          }
                        : {}),
                    ...(imageWithTextContentResults
                        ? {
                              imagesWithText: imageWithTextContentResults.map((item) => ({
                                  id: item.id,
                                  name: item.name,
                                  imageUrl: item.imageUrl,
                                  body: item.body,
                              })),
                          }
                        : {}),
                };
                return results;
            })
        );
    }
}
