export class WebStorageUtility {
    static get(storage: Storage, key: string): any {
        const value = storage.getItem(key);

        return WebStorageUtility.getGettable(value);
    }

    static set(storage: Storage, key: string, value: any): void {
        storage.setItem(key, WebStorageUtility.getSettable(value));
    }

    static remove(storage: Storage, key: string): void {
        storage.removeItem(key);
    }

    private static getSettable(value: any): string {
        return typeof value === 'string' ? value : JSON.stringify(value);
    }

    private static getGettable(value: string): any {
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    }
}
