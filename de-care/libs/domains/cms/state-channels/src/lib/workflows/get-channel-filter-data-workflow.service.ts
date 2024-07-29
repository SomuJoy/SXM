import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, of } from 'rxjs';
import { DataCmsCategoriesService } from '../data-services/data-cms-categories.service';
import { DataCmsGenresService } from '../data-services/data-cms-genres.service';
import { DataCmsTopicsService } from '../data-services/data-cms-topics.service';

interface Data {
    categories: unknown[];
    genres: unknown[];
    topics: unknown[];
}

@Injectable({ providedIn: 'root' })
export class GetChannelFilterDataWorkflowService implements DataWorkflow<void, Data> {
    constructor(
        private readonly _dataCmsCategoriesService: DataCmsCategoriesService,
        private readonly _dataCmsGenresService: DataCmsGenresService,
        private readonly _dataCmsTopicsService: DataCmsTopicsService
    ) {}

    build(): Observable<Data> {
        return of({
            categories: [],
            genres: [],
            topics: [],
        });
    }
}
