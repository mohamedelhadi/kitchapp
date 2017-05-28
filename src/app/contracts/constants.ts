// Storage
export const RESTAURANTS = "RESTAURANTS";
export const FAVORITE_RESTAURANTS = "FAVORITE_RESTAURANTS";
export const CITIES = "CITIES";
export const CUISINES = "CUISINES";
export const BRANCHES = "BRANCHES";
export const DEALS = "DEALS";
export const USER = "USER";

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
