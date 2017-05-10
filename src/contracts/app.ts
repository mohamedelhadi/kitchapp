/* *** App only *** */
export interface IRestaurantsOrderSettings {
    AtoZ: boolean;
    Nearby: boolean;
    TopRated: boolean;
}
export interface IFavorites {
    [index: string]: boolean;
}
