import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { IonicStorageModule } from "@ionic/storage";
import { Environments } from "../environments/configuration";
import { Configuration } from "../environments/env.config";
import { Home, Settings, SideMenu, Splash } from "../pages";
import { Favorites } from "../pages/favorites/favorites";
import { Restaurants } from "../pages/restaurants/restaurants";
import { RestaurantsData } from "../pages/restaurants/restaurants.data";
import { App } from "./app.component";
import { AppErrorHandler, Logger, UI, Utils } from "./helpers";
import { Api } from "./services";
import { Ionic2RatingModule } from "ionic2-rating";
import { Restaurant } from "../pages/restaurant/details/restaurant";
import { RestaurantTabs } from "../pages/restaurant/tabs/tabs";
import { RestaurantsPopover } from "../pages/restaurants/popover/popover";

const _pages = [
    App,
    Splash,
    SideMenu,
    Home,
    Settings,
    Restaurants,
    Restaurant,
    Favorites,
    RestaurantTabs
];

const _components = [
    RestaurantsPopover
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
        AppErrorHandler
    ];
}

export function data() {
    return [
        RestaurantsData
    ];
}

export function providers() {
    return [
        StatusBar,
        SplashScreen,

        ...services(),
        {
            provide: ErrorHandler,
            useClass: AppErrorHandler // env === Environments.Simulator || env === Environments.Dev ? IonicErrorHandler : AppErrorHandler
        },
        ...data()
    ];
}

@NgModule({
    declarations: declarations(),
    imports: [
        BrowserModule,
        HttpModule,
        BrowserAnimationsModule,
        IonicModule.forRoot(App),
        IonicStorageModule.forRoot(),
        Ionic2RatingModule
    ],
    bootstrap: [IonicApp],
    entryComponents: components(),
    providers: providers()
})
export class AppModule { }
