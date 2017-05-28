/* *** App only interfaces *** */
import { RequestOptionsArgs } from "@angular/http";
import { ServerErrorCode } from "./index";

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
export enum Language {
    en = 0,
    ar = 1
}
export interface IAppSettings {
    language: Language;
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
    message?: string;
}
export interface IErrorMessagesDictionary {
    [index: number]: string;
}
