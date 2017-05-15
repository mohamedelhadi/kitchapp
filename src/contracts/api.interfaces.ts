import { Moment } from "moment";
export interface IRestaurant {
    id: number;
    name: string[];
    slogan?: string;
    icon?: string;

    tags: string;
    cuisineIds: number[];
    branches: IBranch[];

    bio: string; // delayed
    categories: ICategory[]; // delayed
    picturedCategories: IPicturedCategory[]; // delayed
}
export interface IPicturedCategory {
    id: number;
    photo: string;
    order: number;
}
export interface IBranch {
    id: number;
    name: string[];
    location: ILocation;
    contact: IContact;  // delayed
    rate: IBranchRateSummary; // delayed (but needed for sort) @##@ generated via auto mapper
    photos: string[]; // delayed
}
export interface ICuisine { // predefined in db, pre-include in app as well
    id: number;
    name: string[];
}
export interface ICategory {
    id: number;
    name: string[];
    children: ICategory[];
    categoryItems: ICategoryItem[];
    // Parent?: ICategory; redundant
}
export interface IContact {
    id: number;
    email?: string;
    website?: string;
    phones: IPhone[];
}
export interface IPhone {
    id: number;
    name: string[];
    number: string;
}
export interface ILocation {
    id: number;
    cityId: number;
    address: string[];
    longitude: number;
    latitude: number;
}
export interface ICity { // predefined in db, pre-include in app as well
    id: number;
    name: string[];
}

export interface ICategoryItem {
    id: number;
    name: string[];
    tags: string;
    cuisineId?: number; // null in case beverage
    variations: IVariation[];
}
export interface IVariation {
    id: number;
    name: string[];
    price: string;
    description?: string;
    photo?: string;
    rate: number; // float
}
export interface IBranchRateSummary { // via auto mapper
    overall: number; // overall = sum of below overalls / 4
    quality: number; // quality overall
    service: number; // service overall
    place: number; // place overall
    price: number; // price overall
}
export interface IUser {
    id: number;
    name: string;

    /*  instead of preventing the user from rating,
        run server side background check and see if a particular variation has been rated by the same device more than 2 times,
        if a match was found, remove all rates except the first
    */
    uuid: string;
}

// ========================== for post requests ============================
export interface IBranchRate {
    quality: number; // 1 <--> 5
    service: number; // 1 <--> 5
    place: number; // 1 <--> 5
    price: number; // 1 <--> 5
    comment?: string;
    user?: IUser;
    branchId: number;
}
export interface IVariationRate {
    rate: number; // 1 <--> 5
    comment?: string;
    user?: IUser;
    variationId: number;
}
