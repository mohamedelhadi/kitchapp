import { Component, ViewChild, AfterViewInit, OnInit } from "@angular/core";
import { Platform, Nav, LoadingController, ToastController, ViewController, App, MenuController, Tab } from "ionic-angular";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { Splash } from "../pages/splash/splash";
import { Subject } from "rxjs/Subject";
import { AppSettings } from "./infrastructure/app.settings";
import { Push } from "./services/index";

export const OnBack$ = new Subject<string>();

@Component({
    template: `<ion-menu [content]="content">
                    <ion-header>
                        <ion-toolbar>
                            <ion-title>Menu</ion-title>
                        </ion-toolbar>
                    </ion-header>

                    <ion-content>
                    </ion-content>
                </ion-menu>

                <!-- Disable swipe-to-go-back because it's poor UX to combine swipe-to-go-back with side menus -->
                <ion-nav #content swipeBackEnabled="false"></ion-nav>`,
    providers: [LoadingController, ToastController]
})
export class AppComponent implements OnInit {
    @ViewChild(Nav) public nav: Nav;
    constructor(
        private app: App, private menu: MenuController, private platform: Platform,
        private statusBar: StatusBar, private splashScreen: SplashScreen,
        private settings: AppSettings, private push: Push) {
        this.initializeApp();
    }
    public async initializeApp() {
        await this.platform.ready();
        this.statusBar.styleDefault();
        this.settings.initLanguage();
        this.push.init();
        this.platform.registerBackButtonAction(() => {
            if (OnBack$.observers.length > 0) {
                OnBack$.next();
            } else {
                const nav = this.app.getActiveNav();
                if (this.menu && this.menu.isOpen()) {
                    return this.menu.close();
                } else if (nav.canGoBack()) {
                    // normal navigations from page to another
                    nav.pop();
                } else if (nav instanceof Tab) {
                    // override tabs default behavior which only takes to previous tab
                    if (nav.index === 0) {
                        nav.parent.parent.pop();
                    } else {
                        nav.parent.select(0);
                    }
                } else {
                    this.platform.exitApp();
                }
            }
        });
    }
    public ngOnInit() {
        this.nav.setRoot(Splash);
    }
}
