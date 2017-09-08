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

    bio: string;
    picturedCategories: IPicturedCategory[];
    email?: string;
    website?: string;
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
    phones: IPhone[];
    photos: string[];
}
export interface ICuisine {
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
export interface ICity {
    id: number;
    name: string[];
}

export interface ICategoryItem {
    id: number;
    name: string[];
    order: number;
    tags: string;
    cuisineId?: number;
    variations: IVariation[];
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
    quality: number;
    service: number;
    place: number;
    price: number;

    ratesCounts?: number[];
    usersCount?: number;

    nUserGaveRate5: number; // calculated on client
    nUserGaveRate4: number; // calculated on client
    nUserGaveRate3: number; // calculated on client
    nUserGaveRate2: number; // calculated on client
    nUserGaveRate1: number; // calculated on client
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
    email: string;
    password?: string;
    token?: string;
    name: string;
    gender: Gender;
    photoUrl?: string;
    profileUrl?: string;
    identifier?: string;
}
export interface IUser {
    id: number;
    name: string;
    phoneNumber?: string;
    email: string;
    photo?: string;
    profileUrl?: string;
    gender?: Gender;
    identifier?: string;
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
export interface ICredentials {
    email: string;
    password: string;
}
