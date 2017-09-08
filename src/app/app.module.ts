﻿import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { HttpModule, Http } from "@angular/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";

import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Ionic2RatingModule } from "ionic2-rating";
import { IonicImageViewerModule } from "ionic-img-viewer";
import { Globalization } from "@ionic-native/globalization";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Network } from "@ionic-native/network";
import { Device } from "@ionic-native/device";

import { IonicStorageModule } from "@ionic/storage";
import { Home, Settings, SideMenu, Splash } from "../pages";
import { Favorites } from "../pages/favorites/favorites";
import { Restaurants } from "../pages/restaurants/restaurants";
import { RestaurantsData } from "./services/data/restaurants.data";
import { AppComponent } from "./app.component";
import { AppErrorHandler, Logger, UI, Utils } from "./helpers";
import { Api, Push, Auth, Identity } from "./services";
import { Restaurant } from "../pages/restaurant/details/restaurant";
import { RestaurantTabs } from "../pages/restaurant/tabs/tabs";
import { RestaurantsPopover } from "../pages/restaurants/popover/popover";
import { Branches } from "../pages/restaurant/branches/branches";
import { LocationPopover } from "../pages/restaurant/branches/location/location.popover";
import { PhonesPopover } from "../pages/restaurant/branches/phones/phones.popover";
import { VariationsPopover } from "../pages/restaurant/details/variations/variations.popover";
import { BranchRatePopover } from "../pages/restaurant/branches/rate/rate.popover";
import { VariationRatePopover } from "../pages/restaurant/details/variation-rate/rate.popover";
import { Cuisines } from "../pages/cuisines/cuisines";
import { AppSettings } from "./infrastructure/index";
import { Subject } from "rxjs/Subject";
import { DeviceMock } from "../mocks/device";
import { Configuration } from "./config/env.config";
import { CitiesData, CuisinesData, DataLoader } from "./services/data/index";
import { Environments } from "./config/configuration";
import { HomePopover } from "../pages/home/popover/popover";
import { Deals } from "../pages/deals/deals";
import { DealsData } from "./services/data/deals.data";
import { Deal } from "../pages/deal/deal";
import { OneSignal } from "@ionic-native/onesignal";

import { Facebook } from "@ionic-native/facebook";
import { FacebookService } from "ngx-facebook";
import { FeedbackPopover } from "../pages/restaurant/details/feedback/feedback.popover";
import { ImageFallbackDirective } from "./shared/index";

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
    Cuisines,
    Deal
];

const _components = [
    RestaurantsPopover,
    LocationPopover,
    PhonesPopover,
    VariationsPopover,
    BranchRatePopover,
    VariationRatePopover,
    HomePopover,
    FeedbackPopover
];

const _directives = [
    ImageFallbackDirective
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
        AppSettings,
        Push,
        Facebook,
        FacebookService,
        Auth,
        Identity
    ];
}
export function dataServices() {
    return [
        RestaurantsData,
        CitiesData,
        CuisinesData,
        DataLoader,
        DealsData
    ];
}
export let browserMocks = [];
if (Configuration.instance.environment === Environments.browser) {
    browserMocks = [
        DeviceMock,
        { provide: Device, useClass: DeviceMock }
    ];
}
export function plugins() {
    return [
        StatusBar,
        SplashScreen,
        Network,
        Device,
        Globalization,
        OneSignal,
        ...browserMocks
    ];
}
export function providers() {
    return [
        ...plugins(),
        ...services(),
        {
            provide: ErrorHandler,
            useClass: AppErrorHandler
        },
        ...dataServices()
    ];
}
export function createTranslateLoader(http: Http) {
    return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
@NgModule({
    declarations: declarations(),
    imports: [
        BrowserModule,
        HttpModule,
        BrowserAnimationsModule,
        IonicModule.forRoot(AppComponent, { animate: false }),
        IonicStorageModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [Http]
            }
        }),
        Ionic2RatingModule,
        IonicImageViewerModule
    ],
    bootstrap: [IonicApp],
    entryComponents: components(),
    providers: providers()
})
export class AppModule { }