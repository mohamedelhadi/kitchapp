import { Moment } from "moment";
export interface IRestaurant {
    Id: number;
    Name: string[];
    Slogan?: string;
    Icon?: string;

    Tags: string;
    CuisineIds: number[];
    Branches: IBranch[];

    Bio: string; // delayed
    Categories: ICategory[]; // delayed
    PicturedCategories: IPicturedCategory[]; // delayed
}
export interface IPicturedCategory {
    Id: number;
    Photo: string;
    Order: number;
}
export interface IBranch {
    Id: number;
    Name: string[];
    Location: ILocation;
    Contact: IContact;  // delayed
    Rate: IBranchRateSummary; // delayed (but needed for sort) @##@ generated via auto mapper
    Photos: string[]; // delayed
}
export interface ICuisine { // predefined in db, pre-include in app as well
    Id: number;
    Name: string[];
}
export interface ICategory {
    Id: number;
    Name: string[];
    Parent?: ICategory;
    Children: ICategory[];
    CategoryItems: ICategoryItem[];
}
export interface IContact {
    Id: number;
    Email?: string;
    Website?: string;
    Phones: IPhone[];
}
export interface IPhone {
    Id: number;
    Name: string[];
    Number: string;
}
export interface ILocation {
    Id: number;
    CityId: number;
    Address: string[];
    Longitude: string;
    Latitude: string;
}
export interface ICity { // predefined in db, pre-include in app as well
    Id: number;
    Name: string[];
}

export interface ICategoryItem {
    Id: number;
    Name: string[];
    Tags: string;
    CuisineId?: number; // null in case beverage
    Variations: IVariation[];
}
export interface IVariation {
    Id: number;
    Name: string[];
    Price: string;
    Description?: string;
    Photo?: string;
    Rate: number; // float
}
export interface IBranchRateSummary { // via auto mapper
    Overall: number; // overall = sum of below overalls / 4
    Quality: number; // quality overall
    Service: number; // service overall
    Place: number; // place overall
    Price: number; // price overall
}
export interface IBranchRate {
    Id: number;
    Quality: number; // 1 <--> 5
    Service: number; // 1 <--> 5
    Place: number; // 1 <--> 5
    Price: number; // 1 <--> 5
    Comment?: string;
    Date: Moment; // it arrives as string, should be converted to moment
    User: IUser;
    Branch: IBranch;
}
export interface IUser {
    Id: number;
    Name: string;

    /*  instead of preventing the user from rating,
        run server side background check and see if a particular variation has been rated by the same device more than 2 times,
        if a match was found, remove all rates except the first
    */
    UUID: string;
}
