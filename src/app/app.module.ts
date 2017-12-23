import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Ionic2RatingModule } from 'ionic2-rating';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { FacebookService } from 'ngx-facebook';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { Device } from '@ionic-native/device';
import { Globalization } from '@ionic-native/globalization';
import { OneSignal } from '@ionic-native/onesignal';
import { Facebook } from '@ionic-native/facebook';
import { Keyboard } from '@ionic-native/keyboard';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '@ionic-native/google-maps';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { DeviceMock } from '../mocks/device';

import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../components/components.module';
import { AppComponent } from './app.component';
import { AppErrorHandler, Logger, UI, Utils } from './helpers';
import {
    Api, Auth, Identity, Push
} from './services';

import { AppSettings } from './infrastructure/index';
import { Configuration } from './config/env.config';
import { Environments } from './config/configuration';

import {
    RestaurantsData, CitiesData, CuisinesData, DataLoader, DealsData
} from './services/data/index';

import {
    Favorites, Cuisines, Deals, Deal,
    Restaurants, Restaurant, RestaurantTabs, RestaurantsPopover,
    VariationsPopover, VariationRatePopover, FeedbackPopover,
    Branches, BranchRatePopover, LocationPopover, PhonesPopover,
    Home, Settings, SideMenu, Splash, LanguagesPopover
} from '../pages';

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
    LanguagesPopover,
    FeedbackPopover
];

const _directives = [
];

const _pipes = [
];

export function declarations() {
    return [..._pages, ..._components, ..._directives, ..._pipes];
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
        Auth,
        Identity,
        Push,
        Facebook,
        FacebookService
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
        Keyboard,
        OneSignal,
        Geolocation,
        GoogleMaps,
        InAppBrowser,
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
export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
    declarations: declarations(),
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        IonicModule.forRoot(AppComponent, {
            menuType: 'overlay', animate: false, backButtonText: '', scrollAssist: true
        }),
        IonicStorageModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        SharedModule,
        ComponentsModule,
        Ionic2RatingModule,
        IonicImageViewerModule
    ],
    bootstrap: [IonicApp],
    entryComponents: components(),
    providers: providers()
})
export class AppModule { }
