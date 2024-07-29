// ===============================================================================
// Angular
import { Injectable } from '@angular/core';

// ===============================================================================
// Imported Features (WebStorageUtility)
import { WebStorageUtility } from './web-storage.utility';

//********************************************************************************
export class WebStorageService {
    localStorageService: LocalStorageService;
    //================================================
    //===               Constructor                ===
    //================================================
    constructor(private storage: Storage) {}

    //================================================
    //===            Getters & Setters             ===
    //================================================
    get(key: string): any {
        return WebStorageUtility.get(this.storage, key);
    }

    set(key: string, value: any): void {
        WebStorageUtility.set(this.storage, key, value);
    }

    //================================================
    //===            Public Functions              ===
    //================================================
    remove(key: string): void {
        WebStorageUtility.remove(this.storage, key);
    }

    clear(): void {
        this.storage.clear();
    }
}

// *********************************************************
// Services (LocalStorageService)
@Injectable({ providedIn: 'root' })
export class LocalStorageService extends WebStorageService {
    constructor() {
        super(localStorage);
    }
}

// *********************************************************
// Services (LocalStorageService)
@Injectable({ providedIn: 'root' })
export class SessionStorageService extends WebStorageService {
    constructor() {
        super(sessionStorage);
    }
}
