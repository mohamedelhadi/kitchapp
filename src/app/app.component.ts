import { Component, ViewChild, AfterViewInit, OnInit } from "@angular/core";
import { Platform, Nav, LoadingController, ToastController, ViewController, App, MenuController, Tab } from "ionic-angular";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { Splash } from "../pages/splash/splash";
import { Subject } from "rxjs/Subject";
import { AppSettings } from "./infrastructure/app.settings";
import { Push } from "./services/index";

export const onBack = new Subject<string>();

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

                <!-- Disable swipe-to-go-back because it's poor UX to combine STGB with side menus -->
                <ion-nav #content swipeBackEnabled="false"></ion-nav>`,
    providers: [LoadingController, ToastController]
})
export class AppComponent implements OnInit {
    @ViewChild(Nav) nav: Nav;
    // @Inject(BACK_EVENT) private onBack: Subject<string>;

    constructor(
        private app: App, private menu: MenuController, private platform: Platform,

        private statusBar: StatusBar, private splashScreen: SplashScreen,
        private settings: AppSettings, private push: Push) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.settings.initLanguage();
            this.push.init();
            this.platform.registerBackButtonAction(() => {
                if (onBack.observers.length > 0) {
                    onBack.next();
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
                    /* in case needed in future
                    const activeView: ViewController = nav.getActive();
                    if (typeof activeView.instance.onBackButton === "function") {
                        activeView.instance.onBackButton();
                    }*/
                }
            });
        });
    }

    ngOnInit() {
        this.nav.setRoot(Splash).then(() => {
            // this.splashscreen.hide();
        });
    }
}
