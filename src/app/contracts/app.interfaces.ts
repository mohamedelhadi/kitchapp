/* *** App only interfaces *** */
import { RequestOptionsArgs } from "@angular/http";
import { ServerErrorCode, Language } from "./index";

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
export interface IDropdownOption {
    text: string;
    value: any;
}
export interface IDistanceDictionary {
    [index: number]: number;
}
export interface IAppSettings {
    language: Language;
    firstLaunch: boolean;
}
export interface IApiOptions extends RequestOptionsArgs {
    appendBaseUrl?: boolean;
    handleError?: boolean;
    showLoading?: boolean;

    /*responseType?: string;
    timeout?: any;
    cache?: boolean;*/
}
export interface IServerError {
    code: ServerErrorCode;
    args?: any[];
}