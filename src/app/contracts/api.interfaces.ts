import { Moment } from "moment";
export interface IRestaurant {
    id: number;
    name: string[];
    slogan?: string;
    icon?: string;
    order: number;

    tags: string;
    cuisineIds: number[];
    branches: IBranch[];
    categories: ICategory[];

    bio: string; // delayed
    picturedCategories: IPicturedCategory[]; // delayed
    email?: string; // delayed
    website?: string; // delayed
}
export interface IPicturedCategory {
    id: number;
    photo: string;
    order: number;
}
export interface IBranch {
    id: number;
    restaurantId: number;
    name: string[];
    order: number;
    location: ILocation;
    rate: IBranchRateSummary;
    phones: IPhone[]; // delayed
    photos: string[]; // delayed
}
export interface ICuisine { // predefined in db, pre-include in app as well
    id: number;
    name: string[];
    order: number;
    photo?: string;
}
export interface ICategory {
    id: number;
    name: string[];
    order: number;
    children: ICategory[];
    categoryItems: ICategoryItem[];

    expanded: boolean; // client side
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
    order: number;
    tags: string;
    cuisineId?: number; // null in case of beverages
    variations: IVariation[]; // delayed
}
export interface IVariation {
    id: number;
    name: string[];
    price: string;
    description?: string[];
    photo?: string;
    rate: number; // float
}
export interface IBranchRateSummary { // via auto mapper
    overall: number; // overall = sum of below overalls / 4
    quality: number; // quality overall
    service: number; // service overall
    place: number; // place overall
    price: number; // price overall

    ratesCounts?: number[]; // delayed
    usersCount?: number; // delayed

    rated5: number; // calculated on client
    rated4: number; // calculated on client
    rated3: number; // calculated on client
    rated2: number; // calculated on client
    rated1: number; // calculated on client
}
export interface IDeal {
    id: number;
    name: string[];
    order: number;
    description: string[];
    oldPrice?: number;
    newPrice?: number;
    photos: string[];
    restaurantId: number;
}

// ========================== for post requests ============================
export interface INewUser {
    identifier: string;
    email: string;
    password?: string;
    token?: string;
    name: string;
    gender: Gender;
    photoUrl?: string;
    profileUrl?: string;
}
export interface IUser {
    id: number;
    /*  instead of preventing the user from rating,
        run server side background check and see if a particular variation has been rated by the same device more than 2 times,
        if a match was found, remove all rates except the first
    */
    identifier: string;
    name: string;
    phoneNumber?: string;
    email: string;
    photo?: string;
    profileUrl?: string;
    gender?: Gender;
}
export enum Gender {
    Male,
    Female
}
export interface IBranchRate {
    quality: number; // 1 <--> 5
    service: number; // 1 <--> 5
    place: number; // 1 <--> 5
    price: number; // 1 <--> 5
    comment?: string;
    branchId: number;
}
export interface IVariationRate {
    rate: number; // 1 <--> 5
    comment?: string;
    variationId: number;
}
export interface IFeedback {
    title?: string;
    message: string;
    type?: FeedbackType;
    restaurantId: number;
    photo?: any;
}
export enum FeedbackType {
    Complaint,
    Inquiry,
    Other = 100
}
