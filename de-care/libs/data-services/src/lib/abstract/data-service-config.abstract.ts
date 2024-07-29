/* Optional configuration settings for an entity collection data service
   such as the `DataService<T>`. */

export abstract class DataServiceConfig {
    /* Is a DELETE 404 really OK? (default: true) */
    delete404OK?: boolean;

    /* Request timeout in MS (default: 0) */
    timeout?: number;
}