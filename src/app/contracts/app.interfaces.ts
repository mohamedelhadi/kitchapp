/* *** App only interfaces *** */
import { RequestOptionsArgs } from '@angular/http';
import { Language } from './index';
import { HttpHeaders, HttpParams } from '@angular/common/http';

export interface IDisposable {
    dispose: () => Promise<void>;
}
export interface IDropdownOption {
    text: string;
    value: any;
}
export interface IAppSettings {
    language: Language;
    isFirstLaunch: boolean;
    dateFormat: string;
    dateTimeFormat: string;
}
export interface IApiOptions {
    appendBaseUrl?: boolean;
    handleError?: boolean;
    handleLoading?: boolean;
    loadingMessage?: string;
    url?: string; // for debug purposes
    // Because Angular's RequestOptionsArgs no longer present in the new http module
    body?: any;
    headers?: HttpHeaders;
    observe?: 'body';
    params?: HttpParams | {
        [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'arraybuffer';
    withCredentials?: boolean;
}
export interface IServerError {
    code: string;
    args?: any[];
}

// Kitchapp specific
export interface IRestaurantsSearchSettings {
    // order settings
    a_to_z: boolean;
    nearby: boolean;
    topRated: boolean;

    // filter settings
    cityId?: number;
    cuisineId?: number;
}
export interface IFavorites {
    [index: string]: boolean;
}
export interface IDistanceDictionary {
    [index: number]: number;
}
