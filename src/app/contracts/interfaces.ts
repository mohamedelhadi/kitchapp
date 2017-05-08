export interface IRestaurant {

    Id: number;
    Name: string;
    Icon?: string;
    Slogan?: string;

    Contact: IContact;
    Location: ILocation;
}

export interface IContact {

    Id: number;
    Email?: string;
    Phone: string;
    Website?: string;
}

export interface ILocation {

    Id: number;
    City: string;
    Address: string;
    Longitude: string;
    Latitude: string;
}