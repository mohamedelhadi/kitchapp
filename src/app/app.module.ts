import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";

import { Ionic2RatingModule } from "ionic2-rating";
import { IonicImageViewerModule } from "ionic-img-viewer";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Network } from "@ionic-native/network";

import { IonicStorageModule } from "@ionic/storage";
import { Environments } from "../environments/configuration";
import { Configuration } from "../environments/env.config";
import { Home, Settings, SideMenu, Splash } from "../pages";
import { Favorites } from "../pages/favorites/favorites";
import { Restaurants } from "../pages/restaurants/restaurants";
import { RestaurantsData } from "../pages/restaurants/restaurants.data";
import { AppComponent } from "./app.component";
import { AppErrorHandler, Logger, UI, Utils } from "./helpers";
import { Api } from "./services";
import { Restaurant } from "../pages/restaurant/details/restaurant";
import { RestaurantTabs } from "../pages/restaurant/tabs/tabs";
import { RestaurantsPopover } from "../pages/restaurants/popover/popover";
import { CitiesData, CuisinesData, DataLoader } from "./shared/data-services";
import { BranchesData } from "../pages/restaurant/branches/branches.data";
import { Branches } from "../pages/restaurant/branches/branches";
import { LocationPopover } from "../pages/restaurant/branches/location/location.popover";
import { PhonesPopover } from "../pages/restaurant/branches/phones/phones.popover";
import { VariationsPopover } from "../pages/restaurant/details/variations/variations.popover";
import { BranchRatePopover } from "../pages/restaurant/branches/rate/rate.popover";
import { VariationRatePopover } from "../pages/restaurant/details/variation-rate/rate.popover";
import { DealsData } from "../pages/restaurant/deals/deals.data";
import { Deals } from "../pages/restaurant/deals/deals";
import { Cuisines } from "../pages/cuisines/cuisines";
import { AppSettings } from "./infrastructure/index";

const _pages = [
    AppComponent,
    Splash,
    SideMenu,
    Home,
    Settings,
    Restaurants,
    Favorites,
    RestaurantTabs,
    Restaurant,
    Branches,
    Deals,
    Cuisines
];

const _components = [
    RestaurantsPopover,
    LocationPopover,
    PhonesPopover,
    VariationsPopover,
    BranchRatePopover,
    VariationRatePopover
];

const _directives = [
];

export function declarations() {
    return [..._pages, ..._components, ..._directives];
}

export function components() {
    return [..._pages, ..._components];
}

export function services() {
    return [
        Configuration,
        Utils,
        Logger,
        UI,
        Api,
        AppErrorHandler,
        AppSettings
    ];
}

export function dataServices() {
    return [
        RestaurantsData,
        CitiesData,
        CuisinesData,
        DataLoader,
        BranchesData,
        DealsData
    ];
}

export function plugins() {
    return [
        StatusBar,
        SplashScreen,
        Network
    ];
}

export function providers() {
    return [
        ...plugins(),
        ...services(),
        {
            provide: ErrorHandler,
            useClass: AppErrorHandler // env === Environments.Simulator || env === Environments.Dev ? IonicErrorHandler : AppErrorHandler
        },
        ...dataServices()
    ];
}

@NgModule({
    declarations: declarations(),
    imports: [
        BrowserModule,
        HttpModule,
        BrowserAnimationsModule,
        IonicModule.forRoot(AppComponent),
        IonicStorageModule.forRoot(),
        Ionic2RatingModule,
        IonicImageViewerModule
    ],
    bootstrap: [IonicApp],
    entryComponents: components(),
    providers: providers()
})
export class AppModule { }
