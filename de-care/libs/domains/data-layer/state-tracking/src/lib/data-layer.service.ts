import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

const windowKey = 'appEventData';

interface PageInfo {
    flowName: string;
    componentName: string;
}

interface ComponentInfo {
    componentName: string;
}

interface ClickInfo {
    linkName: string;
    linkType: string;
    linkKey?: string;
}

interface ErrorEventForFrontEnd {
    readonly errorType: 'USER';
    errorName: string;
}

interface ErrorEventForBusiness {
    readonly errorType: 'BUSINESS';
    errorName: string;
    errorCode: string;
}

interface ErrorEventForApp {
    readonly errorType: 'APP';
    errorName: string;
}

interface ErrorEventForSystem {
    readonly errorType: 'SYSTEM';
    errorName: string;
    errorCode: string;
}

interface Layer {
    event: string;
    [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class DataLayerService {
    private readonly _window: WindowProxy;

    constructor(@Inject(DOCUMENT) readonly _document: Document) {
        if (!_document?.defaultView) {
            throw new Error('Failed to initialize data layer: no window object available');
        }
        this._window = _document.defaultView;
        if (!this._window[windowKey]) {
            this._window[windowKey] = [];
        }
    }

    public eventTrack(event: string, data?: any): void {
        this._pushLayer({ event, ...data });
    }

    public pageTrack(pageInfo: PageInfo): void {
        this.eventTrack('page-loaded', { pageInfo: pageInfo });
    }

    public componentTrack(componentInfo: ComponentInfo): void {
        this.eventTrack('component-loaded', { componentInfo: componentInfo });
    }

    public clickTrack(clickInfo: ClickInfo): void {
        this.eventTrack('user-click', { clickInfo: clickInfo });
    }

    public frontEndErrorsTrack(frontEndErrors: string[]): void {
        const errors = frontEndErrors.map<ErrorEventForFrontEnd>((errorName) => ({ errorType: 'USER', errorName }));
        this.eventTrack('user-error', { errors });
    }

    public businessErrorTrack(businessErrorInfo: ErrorEventForBusiness): void {
        this.eventTrack('business-error', { errorInfo: [businessErrorInfo] });
    }

    public appErrorsTrack(errors: string[]): void {
        const errorInfo = errors.map<ErrorEventForApp>((errorName) => ({ errorType: 'APP', errorName }));
        this.eventTrack('app-error', { errorInfo });
    }

    public systemErrorTrack(error: ErrorEventForSystem): void {
        this.eventTrack('system-error', { errorInfo: [error] });
    }

    private _pushLayer(layer: Layer): void {
        this._window[windowKey].push(layer);
    }

    get flowName() {
        return this._window[windowKey]?.computedState?.flowInfo?.flowName;
    }
}
