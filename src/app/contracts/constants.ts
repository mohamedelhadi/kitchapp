// Storage
export const RESTAURANTS = "RESTAURANTS";
export const FAVORITE_RESTAURANTS = "FAVORITE_RESTAURANTS";
export const CITIES = "CITIES";
export const CUISINES = "CUISINES";
export const BRANCHES = "BRANCHES";
export const DEALS = "DEALS";
export const USER = "USER";
export const SETTINGS = "SETTINGS";
export const FB_TOKEN = "FB_TOKEN";
export const TOKEN = "TOKEN";
export const EXPIRES_AT = "EXPIRES_AT";

// Errors
export enum ErrorCode {
    Unknown,
    Offline,
    GeolocationPositionError
}
export enum ServerErrorCode {
    AlreadyRatedBranch,
    AlreadyRatedItem
}

// Language
export enum Language {
    en = 0,
    ar = 1
}
export const defaultLanguage: Language = Language.en;
export const supportedLanguages: string[] = []; // contains codes of the supported languages
for (const l in Language) {
    if (Language.hasOwnProperty(l) && /^\d+$/.test(l)) { // discard the string keys of the enum
        supportedLanguages[l] = Language[l];
    }
}
